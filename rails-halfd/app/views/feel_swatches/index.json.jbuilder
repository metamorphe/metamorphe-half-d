json.array!(@feel_swatches) do |feel_swatch|
  json.extract! feel_swatch, :id, :name, :skin, :structure, :author, :description
  json.url feel_swatch_url(feel_swatch, format: :json)
end
