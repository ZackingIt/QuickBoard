json.boards {}
json.set! :boards do
  @boards.each do |board|
    json.set! board.id do
      json.author_id board.author_id
      json.title board.title
      json.listIds List.where(board_id: board.id).map{|el| el.id}
    end
  end
end
json.set! :shared_boards do
  @shared_boards.each do |board|
    json.set! board.id do
      json.author_id board.author_id
      json.title board.title
      json.listIds List.where(board_id: board.id).map{|el| el.id}
    end
  end
end
