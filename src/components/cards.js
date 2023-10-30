"use strict"

import { showErrorMessage, checkAll} from './utils'
import { ERROR_SERVER, cardsWrapper } from './varibles'

// Массив данных
let productsData = []

// Загрузка товаров
getProducts()

// Получение товаров
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch ('https://fakestoreapi.com/products')
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json()
        }
        createCards(productsData)
        checkAll()
        
    } catch (err) { 
        showErrorMessage(ERROR_SERVER)
        console.log(err)
    }
}

// Рендер Карточки
function createCards(data) {
    data.forEach(card => {
        const { id, image, title, price} = card
        const cardItem =
        `
            <div class="card" data-product-id="${id}">
                <div class="card__top">
                    <div class="card__image">
                        <img src="${image}" alt="${title}"/>
                    </div>
                </div>
                <div class="card__bottom">
                    <div class="card__price card__price--size">${price}</div>
                    <p class="card__title">${title}</p>
                    <button class="card__add">В корзину</button>
                </div>
            </div>
        `
        cardsWrapper.insertAdjacentHTML('beforeend', cardItem)
    })
}