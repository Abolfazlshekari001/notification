export function Request_Was_Successful1(additional_info: string) {
    return {
      status_code: 201,
      code: 5000,
      message: {
        fa: 'عملیات با موفقیت اجرا شد',
        en: 'The request was successful',
        additional_info: [additional_info],
      },
    };
  }
  export const Request_Was_Successful = {
    status_code: 201,
    code: 5000,
    message: {
      fa: 'عملیات با موفقیت اجرا شد',
      en: 'The request was successful',
    },
  };
  
  export const Request_Was_Successful2 = {
    status_code: 201,
    code: 5000,
    message: {
      fa: 'ادمین کامنت شما را تایید کرده است ',
      en: 'The admin has approved your comment',
    },
  };
  
  export function Request_Was_Successful3(additional_info: string) {
    return {
      status_code: 201,
      code: 5000,
      message: {
        fa: ' عملیات با موفقیت اجرا شدو در انتظار تایید ادمین است',
        en: 'The request was successful and is waiting for admin approval',
  
        additional_info: [additional_info],
      },
    };
  }
  
  export function Request_Was_Successful4(message: string, messageEn: string) {
    return {
      status_code: 201,
      message: {
        fa: message,
        en: messageEn,
      },
    };
  };
  