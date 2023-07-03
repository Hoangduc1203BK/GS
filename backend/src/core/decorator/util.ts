import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const checkEmailDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const email = request.body.email as string;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            throw new Error('Email không đúng định dạng');
        }

        return request;
      },
)