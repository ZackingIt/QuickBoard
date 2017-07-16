class Api::MovesController < ApplicationController

  def create
    p "PARAMSSSSS"
    p params
    if (params.flatten.include?("cardLoad"))
      p "ENTERING SONNN "
      my_id = params[:cardLoad][:starting][:id].to_i
      @card = Card.find(my_id)
      old_list = @card.list
      new_cards = old_list.cards.sort_by{|card| card.ord}

      # need to revise this into a batch process
      i = 0
      while i < new_cards.length
        new_cards[i].update(ord: i)
        i+=1
      end
      old_list_id = @card.list_id
      old_card_order = @card.ord

      new_list_id = params[:cardLoad][:ending][:listId].to_i
      new_card_order = params[:cardLoad][:ending][:cardIndex].to_i
      starting_list_id = params[:cardLoad][:starting][:listId].to_i
      increment_order = []
      decrement_order = []

      increment_order = Card.where(["list_id = ? AND ord > ? AND id <> ?", new_list_id, new_card_order, @card.id])
                            .sort_by{|card| card.ord}

      decrement_order = Card.where(["list_id = ? AND ord <= ? AND id <> ?", new_list_id, new_card_order, @card.id])
                            .sort_by{|card| card.ord}

      decrement_order.each_with_index { |el, idx| el.update(list_id: new_list_id, ord: idx)}
      increment_order.each_with_index { |el, idx| el.update(list_id: new_list_id, ord: (idx + decrement_order.length))}

      @card.update(list_id: new_list_id, ord: new_card_order )

      from_pile = List.find(starting_list_id).cards
                      .sort_by{|card| card.ord}
                      .map{|card| card.id}

      to_pile = List.find(new_list_id).cards
                    .sort_by{|card| card.ord}
                    .map{|card| card.id}

      render json: {cardLoad: params[:cardLoad], cardIds: {fromPile: from_pile, toPile: to_pile}}
    else
      render json: {}
    end

  end

  def move_params
    params.require(:cardLoad).permit!
  end




end
