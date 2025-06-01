from email.message import EmailMessage

from pydantic import EmailStr

from app.config import settings


def create_verification_template(email_to: EmailStr, code: str) -> EmailMessage:
    email = EmailMessage()
    email["Subject"] = "Подтверждение вашей регистрации"
    email["From"] = settings.SMTP_USER
    email["To"] = email_to

    email.set_content(
        f"""
        <div>
            <h2>Подтверждение вашей регистрации</h2>
            <p>Здравствуйте! Для регистрации на нашем сайте, пожалуйста, введите следующий код подтверждения:</p>
            <h2>{code}</h2>
            <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это сообщение.</p>
            <p>С уважением,<br>Команда поддержки CIMO</p>
        </div>
        """,
        subtype="html",
    )

    return email


def create_reset_password_template(email_to: EmailStr, reset_link: str) -> EmailMessage:
    email = EmailMessage()
    email["Subject"] = "Сброс пароля"
    email["From"] = settings.SMTP_USER
    email["To"] = email_to

    email.set_content(
        f"""
        <div>
            <h2>Сброс пароля</h2>
            <p>Здравствуйте! Чтобы сбросить пароль, пожалуйста, перейдите по следующей ссылке:</p>
            <a href="{reset_link}">{reset_link}</a>
            <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.</p>
            <p>С уважением,<br>Команда поддержки CIMO</p>
        </div>
        """,
        subtype="html",
    )

    return email
