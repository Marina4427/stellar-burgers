import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorActions } from '../../services/slices/burger-constructor-slice';

// Компонент для отображения отдельного элемента в конструкторе бургера.
// Обеспечивает функциональность перемещения ингредиента вверх и вниз и удаления ингредиента.
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(
        burgerConstructorActions.replaceIngredient({
          from: index,
          to: index + 1
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        burgerConstructorActions.replaceIngredient({
          from: index,
          to: index - 1
        })
      );
    };

    const handleClose = () => {
      dispatch(burgerConstructorActions.removeIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
