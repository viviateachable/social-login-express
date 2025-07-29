import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Mail, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    user, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithLine,
    signInWithFacebook,
    signInWithGithub,
    signInWithTwitter,
    signInWithApple,
    signInWithAzure,
    signInWithDiscord,
    signInWithGitlab,
    signInWithLinkedin,
    signInWithTwitch,
    signInWithNotion,
    signInWithSlack,
    signInWithSpotify
  } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      toast({
        title: "錯誤",
        description: "請填寫所有欄位",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = isSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (error) {
        let errorMessage = "發生錯誤，請重試";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "登入憑據無效，請檢查您的電子郵件和密碼";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "此電子郵件已註冊，請使用登入功能";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "請先確認您的電子郵件";
        }

        toast({
          title: isSignUp ? "註冊失敗" : "登入失敗",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "註冊成功",
            description: "歡迎加入！",
          });
        } else {
          toast({
            title: "登入成功",
            description: "歡迎回來！",
          });
        }
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "發生未知錯誤，請重試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google 登入失敗",
          description: error.message || "請重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "Google 登入失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLineAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithLine();
      if (error) {
        toast({
          title: "Line 登入",
          description: error.message || "Line 登入功能尚未配置",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "Line 登入失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithFacebook();
      if (error) {
        toast({
          title: "Facebook 登入失敗",
          description: error.message || "請重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "Facebook 登入失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGithub();
      if (error) {
        toast({
          title: "GitHub 登入失敗",
          description: error.message || "請重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "GitHub 登入失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithTwitter();
      if (error) {
        toast({
          title: "Twitter 登入失敗",
          description: error.message || "請重試",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "錯誤",
        description: "Twitter 登入失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAuthHandler = (signInFunction: () => Promise<{ error: any }>, providerName: string) => {
    return async () => {
      setLoading(true);
      try {
        const { error } = await signInFunction();
        if (error) {
          toast({
            title: `${providerName} 登入失敗`,
            description: error.message || "請重試",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "錯誤",
          description: `${providerName} 登入失敗`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  };

  const handleAppleAuth = createAuthHandler(signInWithApple, "Apple");
  const handleAzureAuth = createAuthHandler(signInWithAzure, "Azure");
  const handleDiscordAuth = createAuthHandler(signInWithDiscord, "Discord");
  const handleGitlabAuth = createAuthHandler(signInWithGitlab, "GitLab");
  const handleLinkedinAuth = createAuthHandler(signInWithLinkedin, "LinkedIn");
  const handleTwitchAuth = createAuthHandler(signInWithTwitch, "Twitch");
  const handleNotionAuth = createAuthHandler(signInWithNotion, "Notion");
  const handleSlackAuth = createAuthHandler(signInWithSlack, "Slack");
  const handleSpotifyAuth = createAuthHandler(signInWithSpotify, "Spotify");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">歡迎</CardTitle>
          <CardDescription className="text-center">
            登入您的帳戶或建立新帳戶
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">登入</TabsTrigger>
              <TabsTrigger value="signup">註冊</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="輸入密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(false)} 
                className="w-full"
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "登入中..." : "使用電子郵件登入"}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">電子郵件</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">密碼</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="建立密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(true)} 
                className="w-full"
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {loading ? "註冊中..." : "使用電子郵件註冊"}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-4">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">或</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={handleGoogleAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 登入
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLineAuth}
              className="w-full"
              disabled={loading}
            >
              <div className="mr-2 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              使用 Line 登入
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleFacebookAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              使用 Facebook 登入
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGithubAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              使用 GitHub 登入
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTwitterAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              使用 Twitter 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleAppleAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              使用 Apple 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleAzureAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 12.6l.006-.027a.73.73 0 0 1 .054-.133c.057-.137.102-.222.154-.342l.12-.323c.097-.296.203-.619.32-.967.232-.689.493-1.444.774-2.227.563-1.566 1.21-3.239 1.87-4.831a151.747 151.747 0 0 1 1.113-2.477c.374-.823.75-1.618 1.114-2.337C5.84-.8 6.14-1.29 6.393-1.678L6.558-1.9s.088-.1.14-.151c.026-.026.052-.049.078-.07a.584.584 0 0 1 .145-.1c.05-.028.1-.053.151-.075.051-.022.103-.041.155-.057.052-.016.105-.029.158-.04C7.44-2.408 7.495-2.415 7.55-2.42l.059-.004h.022c.081-.004.162-.004.243.004.162.016.322.048.478.096.156.048.308.112.453.192.145.08.282.176.408.288.126.112.239.24.336.384.097.144.176.304.233.48.057.176.09.369.095.58.005.211-.017.44-.066.686-.049.246-.125.51-.228.792-.103.282-.232.583-.387.903a25.86 25.86 0 0 1-.552 1.006c-.199.36-.414.734-.641 1.12L7.35 3.747c-.227.386-.464.782-.706 1.182-.242.4-.487.803-.732 1.207-.245.404-.488.809-.724 1.214-.236.405-.463.81-.678 1.214-.215.404-.417.807-.604 1.208-.187.401-.358.801-.512 1.198-.154.397-.29.791-.408 1.18-.118.389-.218.773-.302 1.148-.084.375-.151.741-.201 1.096-.05.355-.084.699-.102 1.029-.018.33-.02.646-.005.946.015.3.044.585.087.854.043.269.1.521.169.757.069.236.149.455.24.658.091.203.192.39.303.562.111.172.232.329.363.472.131.143.271.271.42.385.149.114.307.214.472.302.165.088.338.164.518.23.18.066.367.123.561.171.194.048.394.088.599.121.205.033.416.059.632.079.216.02.437.034.663.043.226.009.456.013.689.012h.027c.233-.001.467-.006.705-.014.238-.008.479-.019.724-.033.245-.014.494-.031.747-.051.253-.02.509-.043.769-.069.26-.026.523-.055.789-.087.266-.032.536-.067.809-.105.273-.038.549-.079.829-.123.28-.044.563-.091.85-.141.287-.05.577-.103.87-.159.293-.056.589-.115.888-.177.299-.062.601-.127.906-.195.305-.068.613-.139.924-.213.311-.074.624-.151.940-.231.316-.08.634-.163.954-.249.32-.086.642-.175.966-.267.324-.092.649-.187.976-.285.327-.098.655-.199.984-.303.329-.104.659-.211.990-.321.331-.11.662-.223.994-.339.332-.116.664-.235.996-.357.332-.122.664-.247.996-.375.332-.128.663-.259.994-.393.331-.134.661-.271.99-.411.329-.14.657-.283.984-.429.327-.146.652-.295.976-.447.324-.152.646-.307.966-.465.32-.158.637-.319.952-.483.315-.164.626-.331.935-.501.309-.17.614-.343.916-.519.302-.176.6-.355.895-.537.295-.182.585-.367.871-.555.286-.188.568-.379.845-.573.277-.194.549-.391.816-.591.267-.2.529-.403.785-.609.256-.206.507-.415.752-.627.245-.212.484-.427.717-.645.233-.218.46-.439.681-.663.221-.224.435-.451.643-.681.208-.23.409-.463.604-.699.195-.236.383-.475.564-.717.181-.242.355-.487.522-.735.167-.248.327-.499.479-.753.152-.254.297-.511.434-.771.137-.26.266-.523.387-.789.121-.266.234-.535.339-.807.105-.272.202-.547.291-.825.089-.278.17-.559.242-.842.072-.283.136-.569.191-.857.055-.288.102-.579.14-.872.038-.293.068-.589.089-.887.021-.298.034-.599.038-.902.004-.303 0-.608-.012-.915-.012-.307-.032-.616-.059-.927-.027-.311-.062-.624-.104-.939-.042-.315-.092-.632-.149-.951-.057-.319-.122-.64-.194-.963a19.823 19.823 0 0 0-.273-1.001z"/>
              </svg>
              使用 Azure 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleDiscordAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              使用 Discord 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleGitlabAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452-.955 13.587a.924.924 0 0 0 .331 1.023L12 23.054l10.624-8.443a.924.924 0 0 0 .331-1.024"/>
              </svg>
              使用 GitLab 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleLinkedinAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              使用 LinkedIn 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleTwitchAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              使用 Twitch 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleNotionAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.747-.887l-15.177.887c-.56.047-.748.327-.748.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.747 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
              </svg>
              使用 Notion 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleSlackAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
              </svg>
              使用 Slack 登入
            </Button>

            <Button 
              variant="outline" 
              onClick={handleSpotifyAuth}
              className="w-full"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              使用 Spotify 登入
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}