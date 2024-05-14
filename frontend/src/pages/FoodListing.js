import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { filter } from "../utils/data";
import { Slider } from "@mui/material";
import { getAllProducts } from "../api/index";
import { CircularProgress } from "@mui/material";
import { searchQueryInput } from "../redux/reducer/UserSlice";
import { useSelector } from "react-redux";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: row;
  gap: 30px;
  @media (max-width: 700px) {
    flex-direction: column;
    padding: 20px 12px;
  }
  background: ${props => props.theme.bg};
`;
const Filters = styled.div`
  padding: 20px 16px;
  flex: 1;
  width: 100%;
  max-width: 300px;
  margin-bottom: 65rem;
  @media (max-width: 700px) {
    max-width: 440px;
    margin-bottom: 0rem;
  }
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Products = styled.div`
  flex: 1;
  padding: 20px 0px;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  @media (max-width: 760px) {
    gap: 16px;
  }
`;
const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;
const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Selectableitem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${props => props.theme.text_secondary};
  color: ${props => props.theme.text_secondary};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
`;

const FoodListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const searchInput = useSelector(searchQueryInput);

  const getProducts = async () => {
    setLoading(true);
    await getAllProducts(
      selectedCategory.length > 0
        ? `minPrice=${priceRange[0]}&maxPrice=${
            priceRange[1]
          }&categories=${selectedCategory.join(",")}`
        : searchInput.length > 0
        ? `search=${searchInput}`
        : `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
    )
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getProducts();
  }, [priceRange, selectedCategory, searchInput]);

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters) => (
            <FilterSection>
              <Title>{filters.name}</Title>
              {filters.value === "price" ? (
                <Slider
                  aria-label="Price"
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  valueLableDisplay="auto"
                  marks={[
                    { value: 0, label: "$0" },
                    { value: 1000, label: "$1000" },
                  ]}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                />
              ) : filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <Selectableitem
                      key={item}
                      selected={selectedCategory.includes(item)}
                      className={
                        selectedCategory.includes(item) ? "selected" : ""
                      }
                      onClick={() =>
                        setSelectedCategory((prevCategory) =>
                          prevCategory.includes(item)
                            ? prevCategory.filter(
                                (category) => category !== item
                              )
                            : [...prevCategory, item]
                        )
                      }
                    >{item}
                    </Selectableitem>
                  ))}
                </Item>
              ) : null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>
      <Products>
        <CardWrapper>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {products.map((product) => (
                <ProductCard product={product} />
              ))}
            </>
          )}
        </CardWrapper>
      </Products>
    </Container>
  );
};

export default FoodListing;
