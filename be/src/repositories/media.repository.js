import { Media } from "#models/media.model.js";
import { MongoRepository } from "#repositories/base.repository.js";

/** Repository cho metadata ảnh / video lưu trên Cloudinary. */
export class MediaRepository extends MongoRepository {
  constructor() {
    super(Media);
  }

  findByPublicId(publicId) {
    return this.findOne({ publicId });
  }
}

export const mediaRepository = new MediaRepository();
