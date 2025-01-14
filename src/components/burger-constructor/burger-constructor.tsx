import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  burgerConstructorActions,
  burgerConstructorSelectors
} from '../../services/slices/burger-constructor-slice';
import {
  getOrderBurger,
  orderActions,
  orderSelectors
} from '../../services/slices/orderSlice';
import { getUser, userSelectors } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.userSelector);
  const bun = useSelector(burgerConstructorSelectors.bunSelector);
  const ingredients = useSelector(
    burgerConstructorSelectors.ingredientsSelector
  );
  const orderRequest = useSelector(orderSelectors.isLoadingSelector);
  const orderModalData = useSelector(orderSelectors.orderSelector);

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
    return () => {
      if (orderModalData) {
        dispatch(orderActions.clearOrderModalDataAction());
      }
    };
  }, [dispatch, user, orderModalData]);

  useEffect(() => {
    if (orderModalData) {
      dispatch(burgerConstructorActions.clearIngredients());
      localStorage.removeItem('orderId');
    }
  }, [orderModalData, dispatch]);

  const closeOrderModal = () => {
    dispatch(orderActions.clearOrderModalDataAction());
  };

  //Функция для обработки нажатия кнопки "Оформить заказ".
  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      return navigate('/login');
    }

    const bunId = bun._id;
    const ingredientsIds = ingredients.map((item) => item._id);
    const orderData = [bunId, ...ingredientsIds, bunId];

    dispatch(getOrderBurger(orderData));
  };

  const calculatePrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={calculatePrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
