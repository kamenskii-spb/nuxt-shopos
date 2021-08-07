const nodemailer = require('nodemailer')
const keys = require('../keys')

const emailSetting = {
  host: 'smtp.mail.ru',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: keys.EMAIL,
    pass: keys.EMAIL_PASSWORD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
}

const domen = 'https://бестгифт.рф' || ''


const sendNewPassword = (user) => {
  const transporter = nodemailer.createTransport(emailSetting);

  const mailOptions = {
    from: keys.EMAIL,
    to: user.email,
    subject: 'Новый пароль',
    text: `
        Для получения нового пароля перейдите по ссылки.
        ${domen}/account/remember?key=${user.key}&email=${user.email}&id=${user.id}
        Если ссылка не открывается, скопируйте её в адресную строку браузера.`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    }
  });
}


const confirmation = (userCandidate) => {
  const transporter = nodemailer.createTransport(emailSetting);

  const mailOptions = {
    from: keys.EMAIL,
    to: userCandidate.email,
    subject: 'Подтверждение электронной почты',
    text: `
    Вы получили это письмо, поскольку указали данный почтовый адрес при работе с сайтом 
    ${domen} Нам необходимо убедиться в том, что именно Вы являетесь владельцем этого e-mail адреса.
    Для подтверждения электронного ящика, перейдите по ссылке ниже:
    ${domen}/register?key=${userCandidate.key}&email=${userCandidate.email}
    Если ссылка не открывается, скопируйте её в адресную строку браузера.`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    }
  });
}


const sendOrder = (email, order) => {
  const transporter = nodemailer.createTransport(emailSetting);

  let text = [`Новый каказ ${order.order} 
    <ul>
    <li>Имя: ${order.lastName} ${order.name}</li>
    <li>Адрес: ${order.address} </li>
    <li>Доставка: ${order.delivery.label} </li>
    <li>Телефон: ${order.phone} </li>
    <li>Оплата: ${order.payment.label} </li>
    <li>Коментарий: ${order.comment} </li>
    </ul>
    <br>
    Товары:
    <ul>
    `]

  for (let index = 0; index < order.order_product.length; index++) {
    const item = `<li>${order.order_product[index].name} кол-во: ${order.order_product[index].quantity} артикул: ${order.order_product[index].model} стоимость: ${order.order_product[index].price * order.order_product[index].quantity}</li>`
    text.push(item)
  }
  text.push('</ul> Итого:' + order.totalPrice)

  text = text.join(' ')


  let mailOptions = {
    from: keys.EMAIL,
    to: 'bestgift-spb@mail.ru',
    subject: 'Новый заказ бестгифт.рф',
    html: text

  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {

    }
  });


  // let transporter = nodemailer.createTransport(emailSetting);

  text = [`<p>Ваш заказ получен и поступит в обработку в ближайшее время.<p>`]
  text.push(`<p>Номер заказа ${order.order}</p>`)
  text.push(`<ul>
    <li>Имя фамилия: ${order.name} ${order.lastName} </li>
    <li>Адрес: ${order.address} </li>
    <li>Доставка: ${order.delivery.label} </li>
    <li>Телефон: ${order.phone} </li>
    <li>Оплата: ${order.payment.label} </li>
    <li>Коментарий: ${order.comment} </li>
    </ul>
    <br>
    Товары:
    <ul>
    `)

  for (let index = 0; index < order.order_product.length; index++) {
    const item = `<li>${order.order_product[index].name} кол-во: ${order.order_product[index].quantity} артикул: ${order.order_product[index].model} стоимость: ${order.order_product[index].price * order.order_product[index].quantity}</li>`
    text.push(item)
  }


  text.push('</ul><p> Итого:' + order.totalPrice + '</p>')

  text = text.join(' ')


  mailOptions = {
    from: keys.EMAIL,
    to: order.email,
    subject: 'Заказ',
    html: text

  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {

    }
  });
}

module.exports = {
  sendNewPassword,
  confirmation,
  sendOrder
}
