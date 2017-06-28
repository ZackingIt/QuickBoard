
import React from 'react';
import { values, merge } from 'lodash';
import { findDOMNode } from 'react-dom';
import { DragSource, DragDropContext, DragDropContextProvider, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './card';

const listSource = {
  beginDrag(props) {
    return {
      list_id: props.listId,
      listTarget: props.listObj.ord
    };
  },
};

const style = {
  border: 'none',
  padding: '0px',
  marginBottom: '.5rem',
  backgroundColor: 'none',
  cursor: 'move',
};

const ItemTypes = {
  CARD: 'card',
  LIST: 'list',
};



class List extends React.Component{
  constructor(props){
    super(props);
    console.log("my constructor props below")
    console.log(props)
    this.state = {cardBody: "", listId: props.listId, ord: values(props.listObj.cardIds).length};
    this.handleCreateCard = this.handleCreateCard.bind(this);
    this.handleCreateCardBodyChange = this.handleCreateCardBodyChange.bind(this);
  }

  handleCreateCard(e) {
    e.preventDefault();
    this.props.createCard(this.state.listId, this.state.ord, this.state.cardBody);
    this.setState({
      cardBody: ""
    });
  }

  handleCreateCardBodyChange(e){
    e.preventDefault();
    this.setState({
      cardBody: e.currentTarget.value,
    });
  }


  //arguments of bind are evaluated when bind is invoked(at moment of binding, not onclick)
  //therefore putting params in bind when the params are async is dangerous -- binding will not sync with params
  //our method here works because render is re-called, so bind is re-bound at every keystroke.

  render(){
    if (!this.props.listObj) {
      return <div key={Math.random()*100}></div>;
    }

    const opacity = isDragging ? 0 : 1;

    const listTitle = this.props.listObj.title;
    const { isDragging, connectDragSource, connectDropTarget } = this.props;

    const allCards = this.props.cards;
    console.log("higher ord props of specific list");
    console.log(this.props);
    const cardsBodyArray = this.props.listObj.cardIds.map( (cardId) => {
      const currentCard = allCards[cardId];
      // return ( <div key={cardId} className="card-item-element"> {currentCard.body} </div> );
      return (<Card
        key={Math.random()*100}
        id={cardId}
        handleCardEditSubmit={this.props.handleCardEditSubmit}
        listId={this.state.listId}
        cardIndex={this.props.listObj.cardIds.indexOf(cardId)}
        body={currentCard.body}/>);
    });
    // let cardsBodyArray = [];
    // for (let key in this.props.cards) {
    //   if ( this.props.cards[key].list_id == this.props.listId ){
    //     let newObj = this.props.cards[key];
    //     newObj.id = key;
    //     cardsBodyArray.push(newObj);
    //   }
    // }
    //
    // function compare(a,b) {
    //   return (parseInt(a.ord) - parseInt(b.ord));
    // }
    //
    // console.log("my card body array before sorting");
    // console.log(cardsBodyArray);
    // cardsBodyArray.sort(compare);
    // console.log("my card body array after sorting");
    // console.log(cardsBodyArray);
    // let sortedWrappedCardArray = [];
    // sortedWrappedCardArray = cardsBodyArray.map( ( currentCard ) => {
    //   debugger
    //   // console.log("my listObj card indices are below")
    //   // console.log(this.props.listObj.cardIds.indexOf(parseInt(currentCard.id)))
    //   return (<Card key={Math.random()*100} id={parseInt(currentCard.id)} listId={parseInt(this.state.listId)} cardIndex={currentCard.ord} body={currentCard.body}/>);
    // });


    let listElement = (
      <section className="list-element">
        <div className="list-title-element">
          {listTitle}
        </div>
        <div className="card-array-element">
          {/* { sortedWrappedCardArray } */}
          {cardsBodyArray}
        </div>
        <form className="add-card-button-container" onSubmit={this.handleCreateCard}>
          <input style={{'lineHeight': 200 + 'px'}} onChange={this.handleCreateCardBodyChange} className="add-card-input-element" value={this.state.cardBody}/>
          <button type="submit" className="add-card-button-element">Add</button>
        </form>
      </section>);
      return connectDropTarget(
            <div style={Object.assign({ opacity }, style)}> {listElement} </div>
          );

  }
}

const listTarget = {

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();
    console.log(props)
    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);


    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  },

  hover(props, monitor, component) {
    const listStartingIndex = monitor.getItem().listTarget;
    const listHoverIndex = props.listTarget;

    // console.log("my listTarget Starting Index below");
    // console.log(listStartingIndex);
    //
    // console.log("my listHover Index below (maybe)");
    // console.log(listHoverIndex);

    if (listStartingIndex === listHoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (listStartingIndex < listHoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (listStartingIndex > listHoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

  },
};

const cardTarget = {

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      return;
    }

    console.log("my drop target is below");
    console.log(props);

    const item = monitor.getItem();
    return { moved: true };
  },

  hover(props, monitor, component) {
    const cardStartingIndex = monitor.getItem().cardIndex;
    const listStartingIndex = monitor.getItem().listTarget;
    const cardHoverIndex = props.cardIndex;
    const listHoverIndex = props.listTarget;

    if (cardStartingIndex === cardHoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (cardStartingIndex < cardHoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (cardStartingIndex > cardHoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

  },
};

function connectSource(connect, monitor){
  return{
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function connectTarget(connect){
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export default (DropTarget(ItemTypes.CARD, cardTarget, connectTarget))(List);
