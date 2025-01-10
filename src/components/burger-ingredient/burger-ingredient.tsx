import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorActions } from '../../services/slices/burger-constructor-slice';

//Компонент для отображения отдельного ингредиента бургера.
//Обеспечивает функциональность добавления ингредиента в конструктор.
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(
        burgerConstructorActions.addIngredient({
          ...ingredient,
          id: Math.random().toString()
        })
      );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
