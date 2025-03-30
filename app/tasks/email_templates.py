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
            <p>{code}</p>
            <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это сообщение.</p>
            <p>С уважением,<br>Команда поддержки CIMO</p>
        </div>
        """,
        subtype="html",
    )

    return email
