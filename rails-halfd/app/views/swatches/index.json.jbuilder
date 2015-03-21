json.array!(@swatches) do |swatch|
  json.extract! swatch, :id, :name, :bump_map, :base_height, :displacement, :height, :width, :depth, :stl, :thumbnail, :author
  json.url swatch_url(swatch, format: :json)
end
