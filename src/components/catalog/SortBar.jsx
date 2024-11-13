import React from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { BsGrid3X3, BsList } from 'react-icons/bs';

const SortBar = ({ onSortChange }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Смартфоны</h5>
            <div className="d-flex align-items-center">
                <Dropdown as={ButtonGroup} className="me-2">
                    <Dropdown.Toggle variant="secondary" id="dropdown-sort">
                        По популярности
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onSortChange('priceAsc')}>
                            Цена: по возрастанию
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onSortChange('priceDesc')}>
                            Цена: по убыванию
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="light" className="me-1">
                    <BsGrid3X3 />
                </Button>
                <Button variant="light">
                    <BsList />
                </Button>
            </div>
        </div>
    );
};

export default SortBar;
