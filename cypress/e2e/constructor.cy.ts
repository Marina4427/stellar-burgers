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

  it('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    //булка
    cy.get('[data-test="category"]')
      .eq(0) // Выбираем первый <li>
      .contains('button', 'Добавить') // Ищем кнопку с текстом "Добавить"
      .click();
    cy.get('.constructor-element_pos_top')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');

    cy.get('.constructor-element_pos_bottom')
      .contains('Флюоресцентная булка R2-D3')
      .should('exist');

    //начинка
    cy.get('[data-test="category"]')
      .eq(1)
      .contains('button', 'Добавить')
      .first()
      .click();
    cy.get('.constructor-element')
      .contains('Плоды Фалленианского дерева')
      .should('exist');

    //соус
    cy.get('[data-test="category"]')
      .eq(2)
      .contains('button', 'Добавить')
      .click();
    cy.get('.constructor-element')
      .contains('Соус традиционный галактический')
      .should('exist');
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

  it('Процесс создания заказа', () => {
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'fetchUser'
    );
    cy.wait('@fetchUser');

    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('order');

    cy.get('[data-test="category"]')
      .eq(0)
      .contains('button', 'Добавить')
      .click();
    cy.get('[data-test="category"]')
      .eq(1)
      .contains('button', 'Добавить')
      .click();
    cy.get('[data-test="category"]')
      .eq(2)
      .contains('button', 'Добавить')
      .click();

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@order').its('response.statusCode').should('eq', 200); // Проверка успешного ответа с кодом 200
    // Проверяем что модальное окно с номером заказа открыто

    cy.get('[data-test="modal"]').contains('12345').should('be.visible');
    cy.get('[data-test="modal"]').find('button').click().should('not.exist');

    // Проверяем, что конструктор очищен после создания заказа
    cy.get('.constructor-element_pos_top').should('not.exist');
    cy.get('.constructor-element').should('not.exist');
  });
});
