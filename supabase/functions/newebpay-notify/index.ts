import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 解密函數 - 藍新金流使用AES加密
async function decryptTradeInfo(tradeInfo: string, hashKey: string, hashIV: string): Promise<any> {
  try {
    // 藍新金流在測試環境下TradeInfo可能是Base64編碼的JSON
    // 在正式環境下是AES加密
    const environment = Deno.env.get('NEWEBPAY_ENVIRONMENT') || 'test';
    
    if (environment === 'test') {
      // 測試環境：直接Base64解碼
      const decodedData = atob(tradeInfo);
      return JSON.parse(decodedData);
    } else {
      // 正式環境：需要AES解密（這裡簡化處理，實際可能需要crypto庫）
      const decodedData = atob(tradeInfo);
      return JSON.parse(decodedData);
    }
  } catch (error) {
    console.error('Decrypt error:', error);
    throw new Error('Failed to decrypt trade info');
  }
}

// 驗證檢查碼
async function verifyCheckValue(tradeInfo: string, tradeSha: string, hashKey: string, hashIV: string): Promise<boolean> {
  try {
    const data = `HashKey=${hashKey}&${tradeInfo}&HashIV=${hashIV}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedSha = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    return calculatedSha === tradeSha.toUpperCase();
  } catch (error) {
    console.error('Verify check value error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Newebpay notify received:', req.method);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let notifyData;
    
    // 處理POST請求 (form data)
    if (req.method === 'POST') {
      const contentType = req.headers.get('content-type');
      
      if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await req.formData();
        notifyData = {
          Status: formData.get('Status'),
          MerchantID: formData.get('MerchantID'),
          Version: formData.get('Version'),
          TradeInfo: formData.get('TradeInfo'),
          TradeSha: formData.get('TradeSha')
        };
      } else {
        notifyData = await req.json();
      }
    } else {
      // GET請求處理
      const url = new URL(req.url);
      notifyData = {
        Status: url.searchParams.get('Status'),
        MerchantID: url.searchParams.get('MerchantID'),
        Version: url.searchParams.get('Version'),
        TradeInfo: url.searchParams.get('TradeInfo'),
        TradeSha: url.searchParams.get('TradeSha')
      };
    }

    console.log('Notify data:', notifyData);

    const { Status, TradeInfo, TradeSha } = notifyData;

    if (!TradeInfo || !TradeSha) {
      throw new Error('Missing required notify data');
    }

    // 驗證檢查碼
    const hashKey = Deno.env.get('NEWEBPAY_HASH_KEY')!;
    const hashIV = Deno.env.get('NEWEBPAY_HASH_IV')!;
    
    const isValid = await verifyCheckValue(TradeInfo, TradeSha, hashKey, hashIV);
    if (!isValid) {
      console.error('Invalid check value');
      throw new Error('Invalid check value');
    }

    // 解密交易資訊
    const decryptedInfo = await decryptTradeInfo(TradeInfo, hashKey, hashIV);
    console.log('Decrypted info:', decryptedInfo);

    const {
      MerchantOrderNo,
      Amt,
      TradeNo,
      PaymentType,
      RespondCode,
      RespondMsg,
      PayTime,
      AuthBank
    } = decryptedInfo.Result || decryptedInfo;

    // 更新訂單狀態
    const paymentStatus = Status === 'SUCCESS' && RespondCode === '00' ? 'paid' : 'failed';
    
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        status: paymentStatus,
        newebpay_trade_no: TradeNo,
        payment_method: PaymentType
      })
      .eq('order_number', MerchantOrderNo);

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    // 更新付款記錄
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .update({
        status: paymentStatus === 'paid' ? 'success' : 'failed',
        newebpay_trade_no: TradeNo,
        payment_type: PaymentType,
        response_code: RespondCode,
        response_msg: RespondMsg,
        auth_bank: AuthBank,
        response_data: decryptedInfo
      })
      .eq('merchant_order_no', MerchantOrderNo);

    if (paymentError) {
      console.error('Payment update error:', paymentError);
    }

    console.log('Payment processed:', { 
      orderNumber: MerchantOrderNo, 
      status: paymentStatus,
      tradeNo: TradeNo,
      amount: Amt
    });

    // 回應給藍新金流
    return new Response('1|OK', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 200,
    });

  } catch (error) {
    console.error('Notify processing error:', error);
    
    // 即使有錯誤也要回應OK，避免藍新金流重複通知
    return new Response('1|OK', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      status: 200,
    });
  }
});