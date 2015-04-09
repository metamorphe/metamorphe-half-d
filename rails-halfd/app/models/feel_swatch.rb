# t.string   "name"
# t.integer  "skin"
# t.integer  "structure"
# t.integer  "author"
# t.text     "description"
# t.datetime "created_at"
# t.datetime "updated_at"
    
class FeelSwatch < ActiveRecord::Base
	has_one :texture_swatch
	has_one :structure_swatch
end
