## 📦 Состав

- **Nginx** — проксирует запросы и обслуживает HTTPS.
- **Certbot** — запрашивает и обновляет SSL-сертификаты от Let's Encrypt.
- **Backend** — FastAPI-приложение (порт 8000), доступно по `https://api.cimo-online.ru`.
- **Frontend** — Vite-приложение (порт 5173), доступно по `https://cimo-online.ru`.
- **PostgreSQL**, **Redis**, **Celery**, **Flower** и др.

---

## ⚙️ Предварительные условия

1. Сервер с Docker и Docker Compose.
2. Домен `cimo-online.ru` и поддомен `api.cimo-online.ru`, указывающие на IP сервера.
3. Открыты порты **80** и **443** (например, через `ufw allow` или `firewalld`).

---

## 🔧 1. Настройка конфигурации

### ✅ Проверь файл `nginx.conf`

Убедись, что в нем есть такие блоки:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
И правильно проксируются:

https://cimo-online.ru → frontend:5173

https://api.cimo-online.ru → backend:8000
```

🚀 2. Запуск
📥 Шаг 1: Собрать и поднять всё кроме certbot
```bash
docker compose up -d nginx backend frontend
```
🔐 Шаг 2: Получить HTTPS-сертификаты
```bash
docker compose run --rm certbot
```
Если всё ок — в ./certbot/conf/live/cimo-online.ru/ появятся файлы fullchain.pem, privkey.pem и т.д.

✅ Шаг 3: Перезапустить Nginx с HTTPS
```bash
docker compose restart nginx
```
Теперь:

🔒 https://cimo-online.ru — frontend

🔒 https://api.cimo-online.ru — backend

🔁 3. Автоматическое обновление сертификатов
Let's Encrypt сертификаты живут 90 дней. Обновить вручную:

```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```
Или добавить cron (от root):

```cron
0 3 * * * docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
```
🧼 Полезные команды
Действие	Команда
Запуск всех сервисов	docker compose up -d
Логи конкретного сервиса	docker compose logs -f <service>
Перезапуск Nginx	docker compose restart nginx
Обновить сертификаты	docker compose run --rm certbot renew
Проверка сертификатов	docker exec -it cimo_nginx ls /etc/letsencrypt/live/

🧠 Советы
Проверь, что VIRTUAL_HOST и LETSENCRYPT_HOST не используются, если ты не применяешь nginx-proxy.

Убедись, что certbot использует --webroot, и этот путь совпадает с nginx root.

Сертификаты сохраняются на хосте (внутри Docker volume /etc/letsencrypt).

❓ Поддержка
Если при запуске возникают ошибки certbot, проверь:

домен точно указывает на сервер (ping cimo-online.ru)

порт 80 доступен

nginx отдает /.well-known/acme-challenge/ (можно проверить curl'ом)

---

## 💡 Хочешь автоматизировать ещё больше?

Если нужно, могу:

- сделать bash-скрипт установки
- подготовить CI/CD с деплоем
- заменить на `nginx-proxy` + `acme-companion` для полного zero-config

Скажи, и я помогу.