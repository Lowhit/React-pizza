import React from 'react'
import { Categories, SortPopup, PizzaBlock, PizzaLoadingBlock } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import {setCategory, setSortBy } from '../redux/actions/filters';
import { fetchPizzas } from '../redux/actions/pizzas';
import { addPizzaToCart } from '../redux/actions/cart';

const categoryNames = ['Мясные', 'Вегетерианская', 'Гриль', 'Острые', 'Закрытые'];
const sortIems = [
  {name: 'популярности', type: 'popular', order: 'desc'}, 
  {name: 'цене', type: 'price', order: 'desc'}, 
  {name: 'алфавиту', type: 'name', order: 'asc'}
];

function Home() {
  const dispatch = useDispatch();
  const items = useSelector(({ pizzas }) => pizzas.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
  const { category, sortBy } = useSelector(({ filters }) => filters);
  const cartItems = useSelector(({ cart }) => cart.items);

  React.useEffect(() => {
    dispatch(fetchPizzas(sortBy, category));
  }, [category, sortBy]);


  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index));
  }, []);

  const handleAddPizzaToCart = obj => {
    dispatch({
      type: 'ADD_PIZZA_CART',
      payload: obj,
    });
  }

  const onSelectSortType = React.useCallback((type) => {
    dispatch(setSortBy(type));
  }, []);

  return (
    <div>
      <div className="container">
          <div className="content__top">
            <Categories
              activeCategory={category}
              onClickCategory={onSelectCategory}
              items={categoryNames}
            />
            <SortPopup
          activeSortType={sortBy.type}
          items={sortIems}
          onClickSortType={onSelectSortType}
            />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">
            {
              isLoaded ? items && items.map((obj) =>
              <PizzaBlock onClickAddPizza={handleAddPizzaToCart} key={obj.id} addedCount={cartItems[obj.id] && cartItems[obj.id].items.length} {...obj} />
            ) : Array(12).fill(0).map((_, index) => <PizzaLoadingBlock key={index}/>)}
          </div>
        </div>
    </div>
  );
}

export default Home;