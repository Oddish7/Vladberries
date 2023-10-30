"use strict"

import { showErrorMessage, setCartLocalStorage, getCartLocalStorage, checkAll } from './utils.js'
import { cart, cartProducts, cartBtn, cartCloseBtn, cartBtnSend, cartAlert, cartContainer, cartBottom, cartBtnDeleteAll, cartTotal, ERROR_SERVER, cardsWrapper } from './varibles.js'

// Обработка клика по кнопке "Удалить из корзины"
cartProducts.addEventListener('click', delProductCart)

// Обработка клика по кнопке "В корзину"
cardsWrapper.addEventListener('click', addToCart)

// Открытие и закрытие корзины
cartBtn.addEventListener('click', () => {
    cart.classList.add('cart--open')
    document.body.style.overflow = 'hidden'
})
cartCloseBtn.addEventListener('click', () => {
    cart.classList.remove('cart--open')
    document.body.style.overflow = 'visible'
})
cart.addEventListener('click', (e) => {
    if (!cartContainer.contains(e.target)) {
        cart.classList.remove('cart--open')
        document.body.style.overflow = 'visible'
    }
})

// Удаление из LS все id (Удаление всех товаров из корзины)
cartBtnDeleteAll.addEventListener('click', () => {
    localStorage.clear()
    getProducts()
})

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
        loadProductCart(productsData)
        checkAll()

    } catch (err) { 
        showErrorMessage(ERROR_SERVER)
        console.log(err)
    }
}

// Добавление id товара в LS
function addToCart(e) {
    const targetButton = e.target.closest('.card__add')
    if (!targetButton) return

    const card = targetButton.closest('.card')
    const id = card.dataset.productId
    const cart = getCartLocalStorage()

    if (cart.includes(id)) return

    cart.push(id)
    setCartLocalStorage(cart)
    checkingActiveButtons(cart)
    getProducts()
}

// Блокировка кнопки
export function checkingActiveButtons(cart) {
    const buttons = document.querySelectorAll('.card__add')

    buttons.forEach(btn => {
        const card = btn.closest('.card')
        const id = card.dataset.productId
        const isInCart = cart.includes(id)

        btn.disabled = isInCart
        btn.classList.toggle('active', isInCart)
        btn.textContent = isInCart ? 'В корзине' : 'В корзину'
    })
}

// Удаление конкретного товара из карзины
function delProductCart(e) {
    const targetButton = e.target.closest('.cart__del-card')
    if (!targetButton) return

    const card = targetButton.closest('.cart__product')
    const id = card.dataset.productId
    const cart = getCartLocalStorage()

    const newCart = cart.filter(item => item !== id)
    setCartLocalStorage(newCart)

    getProducts()
}

// Получение id из LS для добавления в корзину и скрытие кнопки в пустой + надпись 
function loadProductCart(data) {
    cartProducts.textContent = ''

    const cart = getCartLocalStorage()

    if(!cart || !cart.length) {
        cartBtnSend.style.display = "none"
        cartAlert.style.display = "block"
        cartContainer.style.justifyContent = 'flex-start'
        cartBottom.style.display = 'none'
        cartTotal.innerHTML = ''
        return
    } else {
        cartBtnSend.style.display = "block"
        cartAlert.style.display = "none"
        cartContainer.style.justifyContent = 'space-between'
        cartBottom.style.display = 'flex'
    }

    const findProducts = data.filter(item => cart.includes(String(item.id)))

    renderProductsCart(findProducts)
}

// Рендер товаров в корзине c подсчетом цены на все
function renderProductsCart(arr) {
    arr.forEach(card => {
        const { id, image, title, price} = card

        const calculatePrice = arr.reduce((prevVal, currentVal) => {
            return prevVal + currentVal.price
        }, 0)
        
        cartTotal.innerHTML = `<span>Итого:</span> ${calculatePrice.toLocaleString()}$`

        const cardItem = 
        `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="${image}" alt="${title}">
            </div>
            <div class="cart__left">
                <div class="cart__title">${title}</div>
                <div class="cart__price">
                    <span>${price}</span>$
                </div>
            </div>
            <div class="cart__del-card">✖</div>
        </div>
        `
        cartProducts.insertAdjacentHTML('beforeend', cardItem)
    })
}



