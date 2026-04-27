import withAuth from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ token }){
            //Jika ada token (login), maka izinkan
            return !!token;
        }
    }
});

export const config = {
    matcher: ['/dashboard/:path*'],
};