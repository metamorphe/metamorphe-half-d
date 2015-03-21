class FeelSwatch < ActiveRecord::Base
	has_one :texture_swatch
	has_one :structure_swatch
end
