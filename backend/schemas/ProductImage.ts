import 'dotenv/config';
import { cloudinaryImage } from '@keystone-next/cloudinary';
import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';

// cloudinary config
export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'sickfits',
};

// set up ProductImage schema
// a list of fields
export const ProductImage = list({
  fields: {
    // cloudinaryImage method from keystone
    image: cloudinaryImage({
      cloudinary,
      label: 'Source',
    }),
    // connects it to other schema
    product: relationship({ ref: 'Product.photo' }),
    altText: text(),
  },
});
