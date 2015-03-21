class Swatch < ActiveRecord::Base
	mount_uploader :thumbnail, ThumbnailUploader
	mount_uploader :bump_map, BumpMapUploader

	belongs_to :user
	belongs_to :layer
end
