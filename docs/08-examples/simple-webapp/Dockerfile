# マルチステージビルド
FROM node:18-alpine AS builder

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci --only=production && npm cache clean --force

# ソースコードをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# 本番用イメージ
FROM nginx:alpine AS production

# セキュリティ設定
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Nginxの設定ファイルをコピー
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# ビルドされたファイルをコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# 権限設定
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# 非rootユーザーで実行
USER nextjs

# ポート公開
EXPOSE 80

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Nginxの起動
CMD ["nginx", "-g", "daemon off;"]