import { Metadata } from 'next';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn-ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
export const metadata: Metadata = {
  title: 'Login',
};
import './login.scss';
const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="login-card">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="w-1/2">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-1/2">
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginPage;
