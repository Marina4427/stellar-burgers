describe('Stellar Burgers - Ingredients', () => {
  beforeEach(() => {
    // Переходим на главную страницу
    cy.visit('/');
    // Перехватываем запросы к API и подставляем фикстуры
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.wait('@getIngredients'); // Убедиться, что запрос завершился
    // Устанавливаем куки и локальное хранилище для имитации авторизации
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'testRefreshToken');
  });

  afterEach(() => {
    // Очищаем локальное хранилище и куки после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Открытие и закрытие модального окна с описанием ингредиента', () => {
    // Закрыть модальное окно через крестик
    cy.get('[data-test="ingredient"]').first().should('exist').click(); // Открыть модальное окно
    cy.get('[data-test="modal"]').should('be.visible'); // Проверить, что модальное окно открылось
    cy.get('[data-test="modal-close"]').should('exist').click(); // Закрыть модальное окно
    cy.get('[data-test="modal"]').should('not.exist'); // Проверить, что модальное окно закрылось

    //Закрыть модальное окно через оверлей
    cy.get('[data-test="ingredient"]').first().should('exist').click();
    cy.get('[data-test="modal"]').should('be.visible'); // Проверить, что модальное окно открылось
    cy.get('[data-test="modal-overlay"]').click({ force: true }); // Клик по оверлею
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('Отображение в открытом модальном окне данных именно того ингредиента, по которому произошел клик', () => {
    // Выбираем первый ингредиент из списка
    cy.get('[data-test="ingredient"]').first().as('selectedIngredient');

    // Получаем текст названия ингредиента перед кликом
    cy.get('@selectedIngredient')
      .find('p')
      .eq(1)
      .invoke('text')
      .as('ingredientName');
    cy.get('@selectedIngredient').click();
    cy.get('[data-test="modal"]').should('be.visible');
    // Проверяем, что заголовок модального окна совпадает с названием ингредиента
    cy.get('@ingredientName').then((name) => {
      cy.get('[data-test="modal"] h3').eq(1).should('contain', name.trim());
    });

    cy.get('[data-test="modal-close"]').click();
    cy.get('[data-test="modal"]').should('not.exist');
  });

  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    // 1. Проверяем, что булка не добавлена в конструктор
    cy.get('[data-test="bun-container"]')
      .should('exist')
      .should('not.contain', 'Флюоресцентная булка R2-D3');

    // 2. Добавляем булку
    cy.get('[data-test="category"]')
      .eq(0)
      .contains('button', 'Добавить')
      .click();

    // 3. Проверяем, что булка появилась в конструкторе
    cy.get('.constructor-element_pos_top')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');
    cy.get('.constructor-element_pos_bottom')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');

    // 4. Проверяем, что начинки нет в конструкторе
    cy.get('[data-test="filling-container"]')
      .should('exist')
      .and('not.contain', 'Плоды Фалленианского дерева');

    // 5. Добавляем начинку
    cy.get('[data-test="category"]')
      .eq(1)
      .contains('button', 'Добавить')
      .first()
      .click();

    // 6. Проверяем, что начинка добавлена
    cy.get('.constructor-element')
      .contains('Плоды Фалленианского дерева')
      .should('exist');
    // 7. Вводим индекс начинок тк их может любое количество в бургере
    // и они могут повторяться
    let index_filling = 0;

    // 8. Проверяем, что соус еще не добавлен
    cy.get('.constructor-element')
      .should('exist')
      .and('not.contain', 'Соус традиционный галактический');

    // 9. Добавляем соус
    cy.get('[data-test="category"]')
      .eq(2)
      .contains('button', 'Добавить')
      .click();

    // 10. Проверяем, что соус добавлен
    cy.get('.constructor-element')
      .contains('Соус традиционный галактический')
      .should('exist');
    index_filling++;

    // 11. Проверяем, что второй соус не добавлен
    cy.get('[data-test="index-filling"]').eq(index_filling).should('not.exist');

    // 12. Добавляем второй соус
    cy.get('[data-test="category"]')
      .eq(2)
      .contains('button', 'Добавить')
      .click();

    // 13. Проверяем, что второй соус добавлен
    cy.get('.constructor-element')
      .contains('Соус традиционный галактический')
      .should('exist');
    index_filling++;
  });

  it('Процесс создания заказа', () => {
    // Перехватываем запросы, которые нам нужны для теста
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'fetchUser'
    );
    cy.wait('@fetchUser'); // Ждем завершения загрузки пользователя

    // Функция для добавления ингредиента из выбранной категории
    const addIngredient = (categoryIndex) => {
      cy.get('[data-test="category"]')
        .eq(categoryIndex)
        .contains('button', 'Добавить')
        .should('exist')
        .first()
        .click();
    };

    // 1. Проверяем, что булка не добавлена в конструктор
    cy.get('[data-test="bun-container"]')
      .should('exist')
      .should('not.contain', 'Флюоресцентная булка R2-D3');

    // 2. Проверяем, что клик по кнопке "Оформить заказ"
    // не вызывает запрос
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');
    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем, что запрос не был отправлен (пока не выбрана булка)
    cy.get('@order.all').should('have.length', 0);

    // 3. Добавляем булку в конструктор
    addIngredient(0); // Добавляем булку

    // 4. Проверяем, что булка появилась в конструкторе
    cy.get('.constructor-element_pos_top')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');
    cy.get('.constructor-element_pos_bottom')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');

    // 5. Нажимаем кнопку "Оформить заказ" снова
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем, что запрос был отправлен
    cy.wait('@order').its('response.statusCode').should('eq', 200);

    // 6. Проверяем, что модальное окно с номером заказа открыто
    cy.get('[data-test="modal"]').contains('12345').should('be.visible');
    cy.get('[data-test="modal"]').find('button').click().should('not.exist');

    // 7. Проверяем, что конструктор очищен после создания заказа
    cy.get('.constructor-element_pos_top').should('not.exist');
    cy.get('.constructor-element').should('not.exist');

    //проверяем что запрос не отправится если выбрана только начинка без булки

    // 1. Проверяем, что начинки нет в конструкторе
    cy.get('[data-test="filling-container"]')
      .should('exist')
      .and('not.contain', 'Плоды Фалленианского дерева');

    // 2. Проверяем, что клик по кнопке "Оформить заказ"
    // не вызывает запрос
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');
    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();
    // Проверяем, что запрос не был отправлен (пустой конструктор)
    // 1 тк один заказ с булками мы отправили
    cy.get('@order.all').should('have.length', 1);

    // 2. Добавляем начинку в конструктор
    addIngredient(1);

    // 3. Проверяем, что начинка добавлена
    cy.get('.constructor-element')
      .contains('Плоды Фалленианского дерева')
      .should('exist');
    // 4. Вводим индекс начинок тк их может любое количество в бургере
    // и они могут повторяться
    let index_filling = 0;

    // 5. Нажимаем кнопку "Оформить заказ" снова
    cy.contains('button', 'Оформить заказ').click();

    //6. Проверяем, что запрос не был отправлен (пока не выбрана булка)
    cy.get('@order.all').should('have.length', 1);

    // 7. Проверяем, что соус еще не добавлен
    cy.get('.constructor-element')
      .should('exist')
      .and('not.contain', 'Соус традиционный галактический');
    //8. добавляем соус
    addIngredient(2);

    // 9. Проверяем, что соус добавлен
    cy.get('.constructor-element')
      .contains('Соус традиционный галактический')
      .should('exist');
    index_filling++;

    // 10. Проверяем, что булка не добавлена в конструктор
    cy.get('[data-test="bun-container"]')
      .should('exist')
      .should('not.contain', 'Флюоресцентная булка R2-D3');

    //11. Добавляем булки
    addIngredient(0);

    // 12. Проверяем, что булка появилась в конструкторе
    cy.get('.constructor-element_pos_top')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');
    cy.get('.constructor-element_pos_bottom')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');

    // 13. Нажимаем кнопку "Оформить заказ" снова, заказ готов
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем, что запрос был отправлен
    cy.wait('@order').its('response.statusCode').should('eq', 200);
    // 14. Проверяем, что модальное окно с номером заказа открыто
    cy.get('[data-test="modal"]').contains('12345').should('be.visible');
    cy.get('[data-test="modal"]').find('button').click().should('not.exist');

    // 15. Проверяем, что конструктор очищен после создания заказа
    cy.get('.constructor-element_pos_top').should('not.exist');
    cy.get('.constructor-element').should('not.exist');
  });
});
