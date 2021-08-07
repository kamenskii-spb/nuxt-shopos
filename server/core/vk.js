const request = require('request')
const FormData = require('form-data')
const fs = require('fs')
const fetch = require('node-fetch')
// https://www.npmjs.com/package/node-fetch#streams

const VkMarket = require('../models/vkMarket.model')


const Product = require('../models/product.model')


const vkCategory = '907'
const main_photo = 1
let imageUrl = 'https://100картин.рф/noimage.jpg'

const vkSettings = async () => {
  return await VkMarket.findOne()
};

const setProduct = async (product, category_id, edit = false) => {
  try {
    const status = product.status === 1? 0 : 1

    const setting = await vkSettings()
    if (!setting.token) return;

    let description = `Артикул: ${product.model}
        `;

    if (product.size) {
      product.name = product.name + ' ' + product.size
    }
    if (
      category_id.toString() === '5e959f79ffb55d1e5c5d2bbd' ||
      category_id.toString() === '5e959fedffb55d1e5c5d2bbe'
    ) {
      description += `
    Набор для раскрашивания содержит:
    - холст, натянутый на подрамник с нанесенным рисунком
    - контрольный лист - акриловые краски (смешивать не нужно)
    - синтетические кисти различных размеров
    - крепеж для подвешивания - упаковка (на русском языке)
    `;
    } else if (category_id.toString() === '5e95a283ffb55d1e5c5d2bc1') {
      description += `
    Размер сумочки 210 *150 *10 мм.
    В набор входит:
    1- сумочка-клатч.
    2- стразы, расфасованные по цветам в пакетики.
    3- стилус для работы с алмазами.
    4- клей-квадрат (розовый).
    5- лоток.
    `;
    } else if (
      category_id.toString() === '5e95a33affb55d1e5c5d2bc2' ||
      category_id.toString() === '5e95a367ffb55d1e5c5d2bc3'
    ) {
      description += `
    
    Как работать с набором?
    На основу картины уже нанесены контуры. Заполните каждый элемент
    витража подходящим по цвету пластилином и оставьте на 5-6 часов
    до полного высыхания.Работы получаются красочные и яркие.
    
    В набор входит:
    -витражный рисунок в раме
    -шариковый пластилин 
    -самоклеющиеся стразы 
    -липучка-держатель
    -образец
    `;
    }

    if (product.images.length) {
      imageUrl = product.images[0].src;
    }

    // console.log('imageUrl',imageUrl)
    // console.log('product',product)


    // получаем url для загрузки
    // https://vk.com/dev/photos.getMarketUploadServer
    const upload_url = await fetch(
        `https://api.vk.com/method/photos.getMarketUploadServer?group_id=${
          setting.group_id
        }&main_photo=${main_photo}&v=5.50&access_token=${setting.token}`
    )
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            console.log(json.error);
          } else {
            return json.response.upload_url;
          }
        });

    // загружаем картинку на сервер
    // https://vk.com/dev/photos.saveMarketAlbumPhoto
    const form = new FormData();
    form.append('file', request(imageUrl), {
      filename: 'bar.jpg',
      contentType: 'multipart/form-data'
    });
    const uploadFile = await fetch(upload_url, {
      method: 'POST',
      body: form
    })
        .then((res) => res.json())
        .then((json) => json);

    // сохраняем
    const imageResp = await fetch(
        `https://api.vk.com/method/photos.saveMarketPhoto?group_id=${
          setting.group_id
        }&photo=${uploadFile.photo}&server=${uploadFile.server}&hash=${
          uploadFile.hash
        }&crop_data=${uploadFile.crop_data}&crop_hash=${
          uploadFile.crop_hash
        }&v=5.103&access_token=${setting.token}`
    )
        .then((res) => res.json())
        .then((json) => {
          return json.response ? json.response[0] : json;
        });

    if (imageResp.error) {
      console.log(imageResp.error);
      return;
    }

    let result = '';

    if (!edit) {
      // добавляем товар
      // https://vk.com/dev/market.add
      result = await fetch(
          `
        https://api.vk.com/method/market.add?owner_id=${
  imageResp.owner_id
}&name=${encodeURIComponent(
    product.name
)}&description=${encodeURIComponent(
    description
)}&category_id=${vkCategory}&price=${product.price}&deleted=0&main_photo_id=${
  imageResp.id
}&v=5.103&access_token=${setting.token}`,
          {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
      )
          .then((res) => res.json())
          .then((json) => {
            return json.response.market_item_id || false
          });
    } else {
      // редактируем товар
      result = await fetch(
          `
        https://api.vk.com/method/market.edit?owner_id=${
  imageResp.owner_id
}&item_id=${product.vkMarketId}&name=${encodeURIComponent(
    product.name
)}&description=${encodeURIComponent(
    description
)}&category_id=${vkCategory}&price=${product.price}&deleted=${status}&main_photo_id=${
  imageResp.id
}&v=5.103&access_token=${setting.token}`,
          {
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            }
          }
      ).then((res) => product.vkMarketId);
    }

    return await result;
  } catch (e) {
    // statements
    console.log(e);
  }
};

const addProducts = (products = [], category_id) => {
  // let index = 0;
  // const lenPr = products.length - 1;
  // let interval = false;
  // let setDes = ''

  // for (let index = 0; index < products.length; index++) {
  //   setDes = async () =>{

  // const $set = {
  //   description: `Набор для раскрашивания содержит:<br>
  //   - холст, натянутый на подрамник с нанесенным рисунком<br>
  //   - контрольный лист - акриловые краски (смешивать не нужно)<br>
  //   - синтетические кисти различных размеров<br>
  //   - крепеж для подвешивания - упаковка (на русском языке)<br>`
  // };


  //   const $set = {
  //   description: `Размер сумочки 210 *150 *10 мм.<br><br>
  //   В набор входит:<br>
  //   1- сумочка-клатч.<br>
  //   2- стразы, расфасованные по цветам в пакетики.<br>
  //   3- стилус для работы с алмазами.<br>
  //   4- клей-квадрат (розовый).<br>
  //   5- лоток.

  //   <img  max-width="400" style="margin-top: 30px"
  //    src="https://bestgift-spb.ru/image/cache/catalog/pictures%20by%20numbers/Klatch/6880-9-500x500.jpg
  //    " alt="сумочка"></img>

  //   <iframe width="100%" height="350" src="https://www.youtube.com/embed/5VzPcMEfqtA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>


  //   <img class="product-img"  style="margin-top: 30px" src="https://bestgift-spb.ru/image/cache/catalog/pictures%20by%20numbers/Klatch/6880-800x800.jpg" alt="сумочка">
  //  </img>
  //   <img class="product-img"  style="margin-top: 30px" src="https://bestgift-spb.ru/image/cache/catalog/pictures%20by%20numbers/Klatch/6880-2-800x800.jpg
  //    " alt="сумочка"></img>

  //   <img class="product-img"  style="margin-top: 30px" src="https://bestgift-spb.ru/image/cache/catalog/pictures%20by%20numbers/Klatch/6880-1-800x800.jpg
  //   " alt="сумочка"></img>`
  //   }

  //  await Product.findOneAndUpdate(
  //   {
  //     _id: products[index]._id
  //   },
  //   { $set },
  //   { new: true }
  // );
  // }

  // setDes()
  // }


  // setProduct(products[index], category_id);
};

const addProduct = (product, category_id) => {
  return setProduct(product, category_id);
};

const deleteProduct = async (item_id) => {
  const setting = await vkSettings();
  await fetch(
      `https://api.vk.com/method/market.delete?owner_id=-${
        setting.group_id
      }&item_id=${item_id}&v=5.103&access_token=${setting.token}`
  )
      .then((res) => res.json())
      .then((json) => json);
};

const editProduct = async (product, category_id) => {
  if (product.vkMarketId) {
    return setProduct(product, category_id, true);
  }
  return
};

module.exports = {
  addProducts,
  addProduct,
  editProduct,
  deleteProduct
};
