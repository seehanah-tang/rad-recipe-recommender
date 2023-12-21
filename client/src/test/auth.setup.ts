import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
    await page.goto("http://localhost:3000/radreciperecommender#/");
    await page.goto("http://localhost:3000/radreciperecommender#/login");
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Sign in with Google" }).click();
    const page1 = await page1Promise;
    await page1.goto(
      "https://accounts.google.com/v3/signin/identifier?opparams=%253Fcontext_uri%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000&dsh=S-1995698749%3A1703127350512859&client_id=981648998753-54j91g6dqdenlqr86hr701gjjqm3v75f.apps.googleusercontent.com&o2v=1&redirect_uri=https%3A%2F%2Frad-recipe-recommender.firebaseapp.com%2F__%2Fauth%2Fhandler&response_type=code&scope=openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+profile&service=lso&state=AMbdmDlDh-IfoimdWdyEJrQIEUpfDR-kzkBA3yaSViI8hV8cSnJx6Q6aCsYRxOeYehjQfXjifJyvuWEWsU7DiJvo08XS9eDlq6O1QA3Uqyfw2VZcitz1aC34s5Rxy3Ha6Wz9H6cBeM_QNQCWK0bJIvTzshxDbUHp_T0iVrAOwEW5T6r1mT6zIgsmOLjv07E0rEpl5U2KB5t9KEiOhraJHacj0aIhZ1kNS2JS_ZaT1dif9t5jJ_L7coYb4JIdOurx-jLatW5SQtCgWeIxiqAF8rNLai6mXXfQEHeGsHNM87TNaSptciO0fFSz1KPDSsE2-VLcrxuprVk5i3Y2knkPntQ&theme=glif&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAO4HhqKVgy-Qz_L9YNJm22LlD09aRWO0ah2lIdVJD-dD0-Z51ezO-v1LJp5abPEZA6-I4xG8I-OuBqrTwpfpsVKCKdElVi_s1EDZLmGGXXFQJnMjMj2Xa3J6k-hTWhKVEAalJBUaSORAzqU6vQrnjlbWRmmfuxcgkGKdr62p8OLDGF6Zy3rJsNzhMsreELXjp7MbLdoCfhTvTCt-SKjU0TpbIapl5GC6oj_-kxOT84oR9qS94x7iHAGZKYIaQkGW8X4AZJow7IoIQDc0KNyB7aJVal-0M4-Xi30C5UgE-NyljKfOAgKl0W2GYEjI3HxCMfPk_j8NUCTsI7vMvsKbS93SRyDHDrPjaGKPHyWofPUloPXlS7XG4iMj7u4-XhYWAL7dHH5bp2j9DQJgEEUGMhpYdsFcDillMimKG5iDLWfSWJiy9lpci3ZeqSGaiRFfMW6nAnnN6BnVXwwYCCPLrOdmwgt7-8tC_3xC2VV2tojFnfoaBOWPkW_wfrYwUzSsX-w7UhK%26as%3DS-1995698749%253A1703127350512859%26client_id%3D981648998753-54j91g6dqdenlqr86hr701gjjqm3v75f.apps.googleusercontent.com%26theme%3Dglif%23&app_domain=https%3A%2F%2Frad-recipe-recommender.firebaseapp.com&rart=ANgoxccq2qTBdeE8ZnvHteV2wQsGMtnK3M9A3q2ehXqNwzy81x3vsYKlK0XJXjxAQSlpRQA88hMFLdlZ7_Ankcne4XTO2WLcb69txjrEmXUP86UJ0HoAzKQ"
    );
    await page1.getByLabel("Email or phone").fill("ohh.louise.weng@gmail.com");
    await page1.getByRole("button", { name: "Next" }).click();
    await page1.goto(
      "https://accounts.google.com/v3/signin/challenge/pwd?TL=AHNYTIQfcxW1zN8j9fIRtc6jCCaR4UlUbVWmvbOD-xXF18jFs3cbk3uo8c3dzV2z&app_domain=https%3A%2F%2Frad-recipe-recommender.firebaseapp.com&checkConnection&checkedDomains&cid=2&client_id=981648998753-54j91g6dqdenlqr86hr701gjjqm3v75f.apps.googleusercontent.com&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hANSIayjahcM6oeLlf8iSnNRM4LFiy-G1SowflT-4VYpk1sLM5tLJqTxjm7GCCuj-C1TtBUblmd-Uj8X3HGQXfgLsnyYy-cD4bGU7LmLD0AyysFjCTROYGmJR6ZVa4Nw-ZsPQomgGEbh3j-s2AYMCwsOQIzgmr6Hfau3UBcmM3zqDkv4YIKupMwk0uCw0RYshY33X7-9y_p6TFpB33wKoroDTdbygGy2uBuAcV1Ns2aKFSnc_X3GWfWNQwoaKfKXp-ZxAiEjd2hU2diHJJat3KIPPwchY9f8PmqQXFjymQQf1ndla2nABWylMTU4JlNFaP3DtHfTNDal5HfIr0-wcQPJsdcvDF3OeiUF1Iv9NQKv66RUMNfEffOr4XXXS4Gx0-II2HcTLJnQnGJ6W8o1r_3BC3KYsw5aTiu-_NQ7CTPLQHh03XgW3vlabqGAACWJTKKnJKnIWkb1qe08BCZhCNv7qob9SfO47sYmr3tKNKiWDT1DKbJHMa_6WDeD_DZMuF4inxye%26as%3DS487551156%253A1703127559674116%26client_id%3D981648998753-54j91g6dqdenlqr86hr701gjjqm3v75f.apps.googleusercontent.com%26theme%3Dglif%23&dsh=S487551156%3A1703127559674116&flowName=GeneralOAuthFlow&o2v=1&opparams=%253Fcontext_uri%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000&pstMsg=0&rart=ANgoxcc9BdCzwY4Lp0ZZ9KTvkZqr7KTh_OBQRL4PMQaDUvnADDR1btONBc1r5mClvXknzs-2WKwy8Lhjx8x4jRmill7LOuPB8Jy5b-_xNrjfO9LCcu3IZbE&redirect_uri=https%3A%2F%2Frad-recipe-recommender.firebaseapp.com%2F__%2Fauth%2Fhandler&response_type=code&scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20profile&service=lso&state=AMbdmDnyS0NCYCtlLoroQO_qTqCXBSS0XOOOx3mWYN2w-nBMvjmp_wZZDnhWgwWP3WJ8DABlJL3Twy-3Si_j-bhlySrbpRcwvWJgykcM3YYt_3m7RrtGhcMcupln1LZ0VkmAeYEgkenEfud6XVAik1H2y6hGGTEpBxdh-qhwnyVOwp195029Hfep0MDl7HHaYBhijX4h3SuuhheOrmIiQQo4csDcBjV-jsQ0UapyibHodoPSqrQCrxBps13jNy2CEaXmtTeJR4qU428dIzRzLhjwdIarYu-Je_Y3QznrCHvHLdCyE_SdqwH8hjx46Ie8hyaHly7trZ5Qu52cagUecLc&theme=glif");
    await page1.getByRole("button", { name: "Next" }).click();
   
    await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("http://localhost:3000/radreciperecommender#/");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
