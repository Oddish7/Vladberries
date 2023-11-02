"use strict"

import { cardsWrapper} from './variables'
import { checkingActiveButtons } from './cart'

//Вывод ошибки
export function showErrorMessage(message) {
    const msg = 
        `<div class='error'>
            <p>${message}<p>
        </div>`
    cardsWrapper.insertAdjacentHTML('afterbegin', msg)
}

// Получение id из LocalStorage
export function getCartLocalStorage() {
    const cartDataJSON = localStorage.getItem('cart')
    return cartDataJSON ? JSON.parse(cartDataJSON) : []
}

// Запись id товаров в LocalStorage
export function setCartLocalStorage(cart) {
    const cartQuantity = document.querySelector('.cart-btn__quantity')
    localStorage.setItem('cart', JSON.stringify(cart))
    cartQuantity.textContent = cart.length
}

// Проверка кнопок карточек и кол-во товаров в корзине
export function checkAll() {
    const cart = getCartLocalStorage()
    checkingActiveButtons(cart)
    setCartLocalStorage(cart)
}
