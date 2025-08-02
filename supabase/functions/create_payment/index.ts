import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  orderData: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    shippingInfo: {
      name: string;
      phone: string;
      address: string;
      email: string;
    };
    totalAmount: number;
  };
}

// 加密函數
async function createCheckValue(params: Record<string, any>, hashKey: string, hashIV: string): Promise<string> {
  const sortedParams = Object.keys(params).sort().reduce((result, key) => {
    result[key] = params[key];
    return result;
  }, {} as Record<string, any>);

  const queryString = new URLSearchParams(sortedParams).toString();
  const data = `HashKey=${hashKey}&${queryString}&HashIV=${hashIV}`;
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 取得用戶資訊
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      throw new Error('Unauthorized');
    }

    const { orderData }: CheckoutRequest = await req.json();

    // 生成訂單編號
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // 建立訂單
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.user.id,
        order_number: orderNumber,
        total_amount: orderData.totalAmount,
        items: orderData.items,
        shipping_info: orderData.shippingInfo,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // 建立付款記錄
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: order.id,
        merchant_order_no: orderNumber,
        amount: orderData.totalAmount,
        status: 'pending'
      });

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // 藍新金流環境設定
    const environment = Deno.env.get('NEWEBPAY_ENVIRONMENT') || 'test';
    const merchantId = Deno.env.get('NEWEBPAY_MERCHANT_ID');
    const hashKey = Deno.env.get('NEWEBPAY_HASH_KEY');
    const hashIV = Deno.env.get('NEWEBPAY_HASH_IV');

    if (!merchantId || !hashKey || !hashIV) {
      throw new Error('Missing Newebpay configuration');
    }

    // Different API URLs for test vs production
    const apiUrl = environment === 'production' 
      ? 'https://core.newebpay.com/MPG/mpg_gateway'
      : 'https://ccore.newebpay.com/MPG/mpg_gateway';
    
    const currentTime = Math.floor(Date.now() / 1000);
    const expireTime = currentTime + (15 * 60); // 15分鐘過期

    const tradeInfo = {
      MerchantID: merchantId,
      RespondType: 'JSON',
      TimeStamp: currentTime,
      Version: '2.0',
      MerchantOrderNo: orderNumber,
      Amt: Math.round(orderData.totalAmount),
      ItemDesc: orderData.items.map(item => `${item.name}x${item.quantity}`).join(','),
      Email: orderData.shippingInfo.email,
      LoginType: 0,
      NotifyURL: `https://trbcpwqvtbieaofirmbi.supabase.co/functions/v1/newebpay-notify`,
      ReturnURL: `https://184abfe0-1648-4cfe-aae5-9a2c57a6932a.lovableproject.com/payment-result`,
      OrderComment: `${environment === 'production' ? '正式' : '測試'}訂單編號: ${orderNumber}`,
      ExpireDate: new Date(expireTime * 1000).toISOString().slice(0, 10),
      ExpireTime: new Date(expireTime * 1000).toTimeString().slice(0, 8)
    };

    // 生成檢查碼
    const checkValue = await createCheckValue(tradeInfo, hashKey, hashIV);

    // 使用Base64編碼交易資訊 (Deno環境)
    const tradeInfoString = JSON.stringify(tradeInfo);
    const base64TradeInfo = btoa(tradeInfoString);

    const newebpayData = {
      MerchantID: merchantId,
      TradeInfo: base64TradeInfo,
      TradeSha: checkValue,
      Version: '2.0'
    };

    console.log(`Newebpay payment created (${environment.toUpperCase()} MODE):`, { 
      orderNumber, 
      amount: orderData.totalAmount,
      environment 
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        orderId: order.id,
        newebpayData,
        paymentUrl: apiUrl,
        environment
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});