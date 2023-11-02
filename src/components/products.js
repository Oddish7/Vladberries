"use strict"

import { showErrorMessage } from './utils.js'
import { ERROR_SERVER, productsPreviewWrapper, cardsWrapper, productsPreview, productsPreviewCloseBtn } from './variables'

// Обработка клика по товару
cardsWrapper.addEventListener('click', showProductsPreview)

// Закрытие предпросмотра товара 
productsPreviewCloseBtn.addEventListener('click', () => {
    productsPreview.classList.remove('products-preview--open')
})
productsPreview.addEventListener('click', (e) => {
    if (!productsPreviewWrapper.contains(e.target)) {
        productsPreview.classList.remove('products-preview--open')
    }
})

// Массив данных
let productsData = []

// Загрузка товаров
getProducts()

// Получение товаров
async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('https://fakestoreapi.com/products');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
    } catch (err) {
        showErrorMessage(ERROR_SERVER)
        console.log(err)
    }
}

// Предпросмотр товара и получение id
function showProductsPreview(e) {
    const cardTop = e.target.closest('.card__top')
    if (!cardTop) return

    const card = cardTop.closest('.card')
    const id = card.dataset.productId

    productsPreview.classList.add('products-preview--open')

    loadProductDetails(id)
}

// Поиск нужного id из массива товаров
function loadProductDetails(id) {
    productsPreviewWrapper.textContent = ''

    const findProduct = productsData.find(card => card.id == id)

    renderInfoProduct(findProduct)
}

// Рендер превью продуктов
function renderInfoProduct(product) {
    const { image, title, price, description } = product;
    const productItem = 
        `
        <div class="product">
            <h2 class="product__title">${title}</h2>
            <div class="product__img">
                <img src="${image}" alt="${title}">
            </div>
            <p class="product__descr">${description}</p>
                <div class="product__price">
                    Цена: <span>${price}$</span>
                </div>
        </div>
        `
        productsPreviewWrapper.insertAdjacentHTML('afterbegin', productItem);
}