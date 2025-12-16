# 🖼️ Open Graph (OG) Image Setup Guide

## ✅ What's Been Implemented

### 1. **Dynamic OG Image Generator** (`app/og/route.tsx`)
- ✅ Automatically generates OG images on-the-fly
- ✅ Customizable by page (title, description, type)
- ✅ Optimized 1200x630px (Facebook/LinkedIn standard)
- ✅ Branded with AILES GLOBAL colors
- ✅ No image files needed!

### 2. **SEO Integration** (`lib/seo.ts`)
- ✅ All pages automatically get OG images
- ✅ Dynamic images based on page title/description
- ✅ Fallback to static image if needed
- ✅ Twitter Card support included

---

## 🎨 How It Works

### Dynamic Images (Recommended)
Every page automatically gets a custom OG image:
- **URL Format:** `https://yourdomain.com/og?title=Page%20Title&description=Page%20Description`
- **Generated on-the-fly:** No image files needed
- **Customizable:** Different colors for different page types

### Example URLs:
```
Homepage:
/og?title=Ailes%20Global&description=Premium%20Study%20Abroad%20Consulting

Scholarship Page:
/og?title=Find%20Scholarships&description=Discover%20fully-funded%20opportunities&type=scholarship

University Page:
/og?title=University%20Matcher&description=Match%20with%20top%20universities&type=university
```

---

## 🎯 Page Types & Colors

### Default (Blue)
- Homepage
- About
- Services
- Contact
- **Color:** Blue (#1e40af) with Gold accent

### Scholarship (Green)
- Scholarship pages
- Scholarship finder
- **Color:** Green (#059669) with Yellow accent
- **Usage:** Add `type=scholarship` to URL

### University (Purple)
- University matcher
- University pages
- **Color:** Purple (#7c3aed) with Light purple accent
- **Usage:** Add `type=university` to URL

---

## 📝 How to Use on Specific Pages

### Option 1: Automatic (Default)
All pages automatically get OG images based on their title and description. No code needed!

### Option 2: Custom Image for Specific Page
If you want a custom static image for a specific page:

```typescript
// In your page.tsx
export const metadata = {
  ...generateSEO({
    title: "My Page Title",
    description: "My page description",
    ogImage: "/custom-og-image.jpg", // Custom image
  }),
}
```

### Option 3: Custom Dynamic Image
Use the dynamic generator with custom parameters:

```typescript
export const metadata = {
  ...generateSEO({
    title: "Scholarship Finder",
    description: "Find your perfect scholarship",
    ogImage: `${baseUrl}/og?title=Scholarship%20Finder&description=Find%20your%20perfect%20scholarship&type=scholarship`,
  }),
}
```

---

## 🖼️ Static Image Option (Fallback)

If you prefer a static image instead of dynamic:

### Step 1: Create the Image
- **Size:** 1200x630px (required)
- **Format:** JPG or PNG
- **Content:** Your brand, logo, tagline
- **Design:** Professional, eye-catching

### Step 2: Add to Public Folder
Place your image at: `public/og-image.jpg`

### Step 3: Update SEO Config
The code will automatically use it as fallback if dynamic generation fails.

---

## 🎨 Design Guidelines

### Recommended Design Elements:
1. **Logo/Brand Name:** Top center
2. **Main Title:** Large, bold, readable
3. **Description:** Smaller text below title
4. **Colors:** Match your brand (blue + gold)
5. **Font:** Sans-serif, bold for title

### Text Guidelines:
- **Title:** Max 60 characters (will auto-resize)
- **Description:** Max 150 characters
- **Font Size:** Auto-adjusts based on length

---

## 🧪 Testing Your OG Images

### 1. **Facebook Sharing Debugger**
- Go to: https://developers.facebook.com/tools/debug/
- Enter your URL
- Click "Scrape Again"
- See preview of how it looks on Facebook

### 2. **Twitter Card Validator**
- Go to: https://cards-dev.twitter.com/validator
- Enter your URL
- See preview of Twitter card

### 3. **LinkedIn Post Inspector**
- Go to: https://www.linkedin.com/post-inspector/
- Enter your URL
- See preview of LinkedIn post

### 4. **Open Graph Preview**
- Go to: https://www.opengraph.xyz/
- Enter your URL
- See preview across platforms

---

## 📊 What Gets Shared

When someone shares your link on:
- ✅ **Facebook:** Shows OG image, title, description
- ✅ **LinkedIn:** Shows OG image, title, description
- ✅ **Twitter:** Shows large image card
- ✅ **WhatsApp:** Shows image, title, description
- ✅ **Telegram:** Shows image, title, description
- ✅ **Slack:** Shows image, title, description

---

## 🚀 Current Implementation

### Pages with OG Images:
- ✅ Homepage (dynamic)
- ✅ About (dynamic)
- ✅ Services (dynamic)
- ✅ Scholarships (dynamic)
- ✅ University Matcher (dynamic)
- ✅ Blog (dynamic)
- ✅ Contact (dynamic)
- ✅ All other pages (dynamic)

### Custom Images Available:
- Scholarship pages can use `type=scholarship` (green theme)
- University pages can use `type=university` (purple theme)

---

## 💡 Pro Tips

### 1. **Test Before Sharing**
Always test your OG images before sharing important links.

### 2. **Clear Cache**
If you update an image, clear the cache:
- Facebook: Use Sharing Debugger
- Twitter: Use Card Validator
- LinkedIn: Use Post Inspector

### 3. **Optimize Images**
- Keep file size under 1MB
- Use JPG for photos, PNG for graphics
- 1200x630px is the sweet spot

### 4. **A/B Test**
Try different images to see which gets more clicks:
- Different colors
- Different layouts
- Different text

---

## 🔧 Troubleshooting

### Image Not Showing?
1. **Check URL:** Make sure image URL is absolute (starts with https://)
2. **Check Size:** Must be 1200x630px minimum
3. **Check Format:** JPG or PNG only
4. **Clear Cache:** Use platform debuggers to clear cache

### Dynamic Image Not Working?
1. **Check Route:** Make sure `/og` route is accessible
2. **Check Parameters:** Title and description must be URL encoded
3. **Check Build:** Make sure route is included in build

### Wrong Image Showing?
1. **Clear Cache:** Use platform debuggers
2. **Check Metadata:** Verify ogImage URL in page source
3. **Check Fallback:** Make sure fallback image exists

---

## ✅ Checklist

- [x] Dynamic OG image generator created
- [x] Integrated with SEO system
- [x] All pages get automatic OG images
- [x] Twitter Card support
- [x] Customizable by page type
- [ ] Test on Facebook Sharing Debugger
- [ ] Test on Twitter Card Validator
- [ ] Test on LinkedIn Post Inspector
- [ ] Create static fallback image (optional)

---

## 📞 Next Steps

1. **Deploy** your site
2. **Test** OG images using debuggers above
3. **Share** a link on Facebook/Twitter/LinkedIn
4. **Verify** image appears correctly
5. **Optimize** based on what looks best

**Your OG images are ready! Deploy and test. 🚀**

---

## 🎨 Example Dynamic Images

### Homepage:
```
https://ailesglobal.com/og?title=Ailes%20Global&description=Premium%20Study%20Abroad%20%26%20Scholarship%20Consulting
```

### Scholarship Page:
```
https://ailesglobal.com/og?title=Find%20Scholarships&description=Discover%20fully-funded%20opportunities&type=scholarship
```

### University Page:
```
https://ailesglobal.com/og?title=University%20Matcher&description=Match%20with%20top%20universities&type=university
```

All images are generated automatically with your branding! 🎉




