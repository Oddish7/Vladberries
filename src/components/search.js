"use strict"

import { searchInput } from './variables'

// Поиск товаров
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase()
    const title = document.querySelectorAll('.card__title')
    const cards = document.querySelectorAll('.card')

    title.forEach((element, index) => {
        if (!element.innerText.toLowerCase().includes(searchValue)) {
            cards[index].classList.add('hide')
        } else {
            cards[index].classList.remove('hide')
        }
    })
})