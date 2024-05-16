
export function Bad_Request_Exception(messegefa: string, messegeen: string) {
    return {
      status_code: 400,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  }
  export const Signing_Up_Faild = {
    status_code: 500,
    code: 1002,
    message: {
      fa: 'ثبت نام با خطا مواجه شده است، لطفا دوباره تلاش کنید',
      en: 'Signing Up faild, please try again later',
    },
  };
  export const Invalid_Input = {
    status_code: 422,
    code: 1003,
    message: {
      fa: 'داده ورودی نا معتبر است',
      en: 'The input data is invalid',
    },
  };
  
  
  export const Invalid_Input_Faild = {
    status_code: 422,
    code: 1003,
    message: {
      fa: 'کامنت شما هنوز توسط ادمین تایید نشده است ',
      en: 'Your comment has not yet been approved by the admin',
    },
  };
  
  
  export function InternalServerError(messege: string) {
    return {
      status_code: 500,
      code: 1003,
      message: {
        fa: 'خطای سرور',
        en: messege,
      },
    };
  }
  export function DataNotFound1(additional_info: string) {
    return {
      status_code: 409,
      code: 1004,
      message: {
        fa: 'داده پیدا نشد ',
        en: 'Data Not Found',
        additional_info: [additional_info],
      },
    };
  }
  
  export function DataNotFound(messegefa: string, messegeen: string) {
    return {
      status_code: 409,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  }
  
  
  export const TheDataHasAlreadyBeenDeleted = {
    status_code: 410,
    code: 1004,
    message: {
      fa: 'داده از قبل پاک شده است',
      en: 'The data has already been deleted',
    },
  };
  
  export const forbiddenResource = {
    status_code: 403,
    code: 1004,
    message: {
      fa: 'به این مسیر دسترسی ندارید',
      en: 'Forbidden resource',
    },
  };
  
  export const Data_Field_Is_Duplicate = {
    status_code: 500,
    code: 1000,
    message: {
      fa: 'داده تکراری است',
      en: 'Data Field Is Duplicate',
    },
  };
  
  export function Unauthorized(messegefa: string, messegeen: string) {
    return {
      status_code: 401,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  }
  
  
  export function Request_Timeout(messegefa: string, messegeen: string) {
    return {
      status_code: 408,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  }
  
  export function PageNotFound(messegefa: string, messegeen: string) {
    return {
      status_code: 404,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  }
  
  export function NoContent (messegefa: string, messegeen: string) {
    return {
      status_code: 409,
      message: {
        fa: messegefa,
        en: messegeen,
      },
    };
  };
  
  
  
  
  export const Invalid_Token = {
    status_code: 402,
    code: 1014,
    message: {
      fa: 'توکن نامعتبر است',
      en: 'Invalid Token',
    },
  };
  
  
  export const Total_Resend_Code = {
    status_code: 429,
    code: 1022,
    message: {
      fa: "تا ۲۴ ساعت آینده ارسال مجدد کد امکان پذیر نیست ",
      en: "Please try 24 hours later again",
    },
  };
  
  
  export const Double_comment = {
    status_code: 401,
    code: 1004,
    message: {
      fa: 'بیشتر از یک پاسخ نمیتوانید بدهید',
      en: 'You cannot give more than one answer.',
    },
  }
  
  export const DataNotFound2 = {
    status_code: 409,
    code: 1004,
    message: {
      fa: 'داده پیدا نشد ',
      en: 'Data Not Found',
    },
  };
  
  
  
  
  
  
  