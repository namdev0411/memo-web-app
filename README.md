# 📝 Memo App - Quản lý Memo thông minh với Salesforce

Ứng dụng web hiện đại để quản lý memo được xây dựng với React + Vite và tích hợp với Salesforce thông qua OAuth2 và REST API.

## ✨ Tính năng chính

- 🔐 **Xác thực OAuth2** với Salesforce (Implicit Grant)
- 📋 **CRUD Operations** cho Memo (Create, Read, Update, Delete)
- 👁️ **View Mode**: Xem chi tiết memo (read-only)
- ✏️ **Edit Mode**: Chỉnh sửa memo với form validation
- 🔄 **Real-time Refresh**: Nút tải lại danh sách memo
- 📱 **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- 🎨 **Modern UI/UX**: Thiết kế đẹp với Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: Tailwind CSS
- **Authentication**: OAuth2 (Salesforce)
- **API**: Axios, Salesforce REST API
- **Backend**: Salesforce Apex REST Classes

## 📋 Yêu cầu hệ thống

- Node.js >= 19.0.0
- npm >= 9.0.0
- Salesforce Developer Account
- Salesforce Connected App được cấu hình

## 🚀 Cài đặt và chạy ứng dụng

### 1. Clone và cài đặt dependencies

```bash
# Clone repository
cd web-app

# Cài đặt dependencies
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` trong thư mục `web-app/` với nội dung:

```bash
# Salesforce OAuth2 Configuration
VITE_SF_CLIENT_ID=your_connected_app_client_id
VITE_SF_CLIENT_SECRET=your_connected_app_client_secret
VITE_SALESFORCE_LOGIN_URL=https://your-domain.my.salesforce.com
VITE_SALESFORCE_API_BASE_URL=https://your-domain.my.salesforce.com/services/apexrest
VITE_REDIRECT_URI=http://localhost:3000/auth/callback

# Development
VITE_NODE_ENV=development
```

### 3. Cấu hình Salesforce

#### a) Tạo Connected App trong Salesforce:

1. **Setup** → **App Manager** → **New Connected App**
2. **Connected App Name**: `Memo App`
3. **API Name**: `Memo_App`
4. **Contact Email**: your-email@domain.com
5. **Enable OAuth Settings**: ✅
6. **Callback URL**: `http://localhost:3000/auth/callback`
7. **Selected OAuth Scopes**:
   - Access your basic information (id, profile, email, address, phone)
   - Access and manage your data (api)
   - Perform requests on your behalf at any time (refresh_token, offline_access)
   - Provide access to your data via the Web (web)
   - Full access (full)

#### b) Tạo Custom Object Memo__c:

1. **Setup** → **Object Manager** → **Create** → **Custom Object**
2. **Object Label**: `Memo`
3. **Object Name**: `Memo`
4. **API Name**: `Memo__c`
5. **Fields**:
   - `Name__c` (Text, 255) - Tiêu đề memo
   - `Description__c` (Long Text Area, 32,768) - Nội dung memo

#### c) Deploy Apex REST Classes:

Sao chép và deploy các file Apex từ thư mục `salesforce/`:
- `MemoRegistration.cls` - REST API cho CRUD operations
- `MemoUpdate.cls` (nếu có) - Additional REST endpoints

#### d) Cấu hình CORS Settings (Bắt buộc):

1. **Setup** → **Security** → **CORS**
2. **New** → **Origin URL Pattern**: Thêm cả 2 domains:
   - `http://localhost:3000` (cho development)
   - `https://your-vercel-domain.vercel.app` (cho production)
3. **Ví dụ**: 
   - `http://localhost:3000`
   - `https://memo-web-app-psi.vercel.app`
4. **Save**

⚠️ **Lưu ý CORS**: 
- **Bắt buộc** cho cả development và production
- Nếu không có CORS, API calls sẽ bị chặn
- Phải setup trước khi chạy app hoặc deploy

### 4. Chạy ứng dụng

```bash
# Chạy development server
npm run dev

# Ứng dụng sẽ chạy tại http://localhost:3000
```

## 📖 Hướng dẫn sử dụng

### 1. Đăng nhập
- Truy cập `http://localhost:3000`
- Nhấn "Đăng nhập với Salesforce"
- Hoàn thành OAuth2 flow với Salesforce

### 2. Quản lý Memo
- **Xem danh sách**: Trang chủ hiển thị tất cả memo
- **Thêm mới**: Nhấn "Thêm Memo mới" → Điền form → "Tạo memo"
- **Xem chi tiết**: Click vào memo card → Xem thông tin đầy đủ
- **Chỉnh sửa**: Từ trang chi tiết → "Chỉnh sửa" → Cập nhật → "Cập nhật memo"
- **Xóa**: Từ trang chi tiết hoặc danh sách → "Xóa" → Xác nhận
- **Tải lại**: Nhấn "Tải lại" để refresh danh sách

### 3. Navigation Flow
```
Home → View Details → Edit → Back to View
Home → Direct Edit → Back to Home
Home → New Memo → Back to Home
```

## 🔧 Configuration Details

### Environment Variables

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_SF_CLIENT_ID` | Consumer Key từ Connected App | `3MVG9pRzvMkjMb6m...` |
| `VITE_SF_CLIENT_SECRET` | Consumer Secret từ Connected App | `088B73B70AECA07F...` |
| `VITE_SALESFORCE_LOGIN_URL` | Base URL của Salesforce org | `https://domain.my.salesforce.com` |
| `VITE_SALESFORCE_API_BASE_URL` | API endpoint cho Apex REST | `https://domain.my.salesforce.com/services/apexrest` |
| `VITE_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/auth/callback` |

### CORS Configuration (Bắt buộc cho mọi environment)

| Bước | Mô tả | Example |
|------|-------|---------|
| **1. Salesforce CORS Setup** | Setup → Security → CORS → New | Thêm từng domain riêng |
| **2. Development Domain** | `http://localhost:3000` | Exact match, không trailing slash |
| **3. Production Domain** | `https://your-vercel-domain.vercel.app` | Exact match với deployed domain |
| **4. Multiple Entries** | Tạo riêng entry cho mỗi domain | Không thể dùng wildcard |

⚠️ **Lưu ý**: CORS là bắt buộc cho cả development và production. Không có CORS = API calls bị block!

### OAuth2 Flow

1. **Authorization Request**: User click → Redirect to Salesforce
2. **User Authorization**: User login → Grant permissions
3. **Authorization Grant**: Salesforce → Redirect with access_token (Implicit Grant)
4. **Access Token**: App extracts token from URL fragment → Store in localStorage
5. **API Requests**: Include token in Authorization header

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/memo` | Lấy danh sách tất cả memo |
| `POST` | `/api/memo` | Tạo memo mới |
| `GET` | `/api/memo/update/{id}` | Lấy chi tiết memo theo ID |
| `PATCH` | `/api/memo/update/{id}` | Cập nhật memo theo ID |
| `DELETE` | `/api/memo/{id}` | Xóa memo theo ID |

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 → #1E40AF)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Neutral**: Gray scale (#F9FAFB → #111827)

### Components
- **Buttons**: Consistent padding, rounded corners, hover effects
- **Forms**: Proper validation, loading states, error handling
- **Cards**: Shadow, hover effects, clean layout
- **Navigation**: Breadcrumbs, back buttons, intuitive flow

## � Deployment

### Quick Deploy với Vercel (Recommended)

1. **Connect GitHub repo**: 
   - Login vào [vercel.com](https://vercel.com)
   - Import project từ GitHub

2. **Environment Variables** (Settings → Environment Variables):
   ```bash
   VITE_SF_CLIENT_ID=your_consumer_key
   VITE_SF_CLIENT_SECRET=your_consumer_secret  
   VITE_SALESFORCE_LOGIN_URL=https://domain.my.salesforce.com
   VITE_SALESFORCE_API_BASE_URL=https://domain.my.salesforce.com/services/apexrest
   VITE_REDIRECT_URI=https://your-app.vercel.app/auth/callback
   ```

3. **Deploy**: Vercel tự động build và deploy khi push code

4. **Update Salesforce CORS**: Thêm domain production vào CORS settings
   - Example: `https://memo-app-xyz.vercel.app`

### Alternative Deployment Options

#### Netlify
Tạo file `public/_redirects`:
```
/*    /index.html   200
```

#### GitHub Pages  
Thêm vào `package.json`:
```json
"homepage": "https://yourusername.github.io/repo-name"
```

#### Apache Server
Tạo file `public/.htaccess`:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 🚨 Troubleshooting

### Lỗi 404 khi deploy (SPA Routing)
File `vercel.json` đã được cấu hình để handle client-side routing ✅

#### Debug steps nếu vẫn gặp lỗi:
1. **Check build output**:
   ```bash
   npm run build
   ls dist/  # Phải có index.html, assets/, etc.
   ```

2. **Test local build**:
   ```bash
   npm run preview
   # Navigate to different routes để test
   ```

3. **Check deployment logs** trên Vercel dashboard
4. **Verify environment variables** đã set đúng trên Vercel

### Lỗi CORS
- **Setup CORS trong Salesforce**: Setup → Security → CORS → Add Origin URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-app.vercel.app`
- **Bắt buộc cho cả 2**: API calls sẽ bị block nếu thiếu bất kỳ entry nào

#### CORS Setup Chi tiết:
1. **Salesforce Setup** → **Security** → **CORS**
2. **New CORS Entry** (tạo 2 entries riêng biệt):
   
   **Entry 1 - Development**:
   - **Origin URL Pattern**: `http://localhost:3000`
   
   **Entry 2 - Production**:
   - **Origin URL Pattern**: `https://your-app.vercel.app`

3. **Save** cả 2 entries
   
   **Entry 2 - Production**:
   - **Origin URL Pattern**: `https://your-vercel-domain.vercel.app`
   
3. **Important Notes**:
   - **Exact match**: Phải chính xác domain và port
   - **No wildcards**: Không thể dùng `*` hoặc patterns
   - **Both required**: Cần cả 2 cho dev và prod
4. **Multiple environments**: Staging, UAT cũng cần entries riêng

### Token hết hạn
- App tự động detect token expiry
- User sẽ được redirect về login page

### API Errors
- Check Developer Console trong Salesforce
- Verify Apex class permissions và field accessibility

### Environment Issues
- Đảm bảo tất cả biến môi trường được set đúng
- Restart development server sau khi thay đổi .env.local

### Common Deploy Issues

#### Build fails:
```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Blank page after deploy:
- Check browser console for errors
- Verify base URL trong Vite config
- Check if all assets load correctly

#### OAuth redirect fails:
- Update Salesforce Connected App callback URL
- Use HTTPS URL của deployed app
- Check CORS settings

## 📝 Development Notes

### Project Structure
```
src/
├── components/          # Shared components
│   ├── MemoForm.jsx    # Form cho create/edit memo
│   ├── MemoList.jsx    # Danh sách memo cards
│   └── TestConnection.jsx
├── pages/              # Page components
│   ├── Home.jsx        # Trang chủ/danh sách
│   ├── Login.jsx       # Trang đăng nhập
│   ├── ViewMemo.jsx    # Xem chi tiết memo
│   ├── EditMemo.jsx    # Chỉnh sửa memo
│   ├── NewMemo.jsx     # Tạo memo mới
│   └── AuthCallback.jsx # OAuth callback handler
├── auth/hooks/         # Authentication hooks
├── utils/              # Utilities (axios config, etc.)
└── routes.jsx          # React Router configuration
```

### Key Features Implementation
- **Authentication**: useAuthenticated hook + Layout wrapper
- **Routing**: React Router với nested routes
- **State Management**: Local state với hooks
- **API Integration**: Axios với interceptors
- **Error Handling**: Try-catch với user-friendly messages

## 📄 License

MIT License - Phát triển bởi AI Assistant

---

**Happy Coding! 🚀**
