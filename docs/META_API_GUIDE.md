# Meta Graph API Setup Guide

This guide explains how to obtain the necessary credentials and IDs to interact with the Meta (Facebook/Instagram) Graph API for the ToxiGuard project.

## 1. Prerequisites
- A Meta Developer Account.
- A Meta App created (you already have "ToxiGuard").
- A Facebook Page connected to your Instagram Business Account (if you want to manage Instagram comments).

## 2. Getting an Access Token
You are currently in the **Graph API Explorer**. This is the right place to start.

1.  **Select App**: Ensure "ToxiGuard" is selected in the "Meta App" dropdown.
2.  **Select User or Page**:
    - Select **"Get User Access Token"** initially to grant permissions.
3.  **Add Permissions**:
    - In the "Permissions" section, add the following permissions depending on your needs.
    - **Tip**: Type the name and **select it from the dropdown list** that appears. Do not type the backticks (`).
        - public_profile (Default)
        - pages_show_list (To list your pages)
        - pages_read_engagement (To read comments on Pages)
        - pages_manage_metadata
        - pages_manage_posts
        - pages_manage_engagement (To reply/delete comments on Pages)
        - instagram_basic (To read Instagram profile info)
        - instagram_manage_comments (To read/reply/delete Instagram comments)
        - instagram_manage_insights (Optional)
4.  **Generate Token**: Click **"Generate Access Token"**. You will be asked to log in and grant permissions.

## 3. Getting a Long-Lived Access Token
The token generated in the Explorer is short-lived (valid for ~1 hour). You need a long-lived token (valid for ~60 days) for your application.

1.  Copy the Access Token you just generated.
2.  Go to the **Access Token Debugger**: https://developers.facebook.com/tools/debug/accesstoken/
    - Or click the "i" (info) icon inside the Access Token field in the Explorer and click "Open in Access Token Tool".
3.  Paste your token and click **"Debug"**.
4.  Scroll down to the bottom and click **"Extend Access Token"**.
5.  This will generate a **Long-Lived User Access Token**. Copy this token.

## 4. Getting Page ID and Instagram Business ID
Now you need to find the IDs of the Pages and Instagram accounts you want to manage.

1.  Back in the **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
2.  Paste your **Long-Lived Access Token** into the Access Token field.
3.  In the query field (where it says `me?fields=id,name`), enter the following query to get your Pages and connected Instagram accounts:
    ```
    me/accounts?fields=id,name,access_token,instagram_business_account
    ```
4.  Click **"Submit"**.
5.  **Response**:
    - `id`: This is your **Facebook Page ID**.
    - `access_token`: This is the **Page Access Token** (specific to that page, often needed for page-specific operations).
    - `instagram_business_account.id`: This is your **Instagram Business Account ID**.

## 5. Environment Variables
Add these values to your `.env` file (do not commit this file):

```env
# Meta / Facebook / Instagram
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_USER_ACCESS_TOKEN=your_long_lived_user_token
# OR
META_PAGE_ACCESS_TOKEN=your_page_access_token

# IDs
META_PAGE_ID=your_page_id
META_IG_USER_ID=your_instagram_business_id
```

## 6. Testing the API
You can test fetching comments using the Explorer or Postman:

**Get Instagram Media:**
```
GET /{ig-user-id}/media
```

**Get Comments on Media:**
```
GET /{media-id}/comments
```
