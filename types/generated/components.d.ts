import type { Schema, Struct } from '@strapi/strapi';

export interface TextFieldPrimaryAdsCard extends Struct.ComponentSchema {
  collectionName: 'components_text_field_primary_ads_cards';
  info: {
    description: '';
    displayName: 'Primary ads card';
    icon: 'chartBubble';
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    thumbnail: Schema.Attribute.Media<'images' | 'files'>;
    with_deposit: Schema.Attribute.String;
    without_deposit: Schema.Attribute.String;
  };
}

export interface TextFieldRepeatable extends Struct.ComponentSchema {
  collectionName: 'components_text_field_repeatables';
  info: {
    description: '';
    displayName: 'repeatable';
    icon: 'apps';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface TextFieldSidebarAdsCards extends Struct.ComponentSchema {
  collectionName: 'components_text_field_sidebar_ads_cards';
  info: {
    description: '';
    displayName: 'sidebar ads cards';
    icon: 'dashboard';
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    read_the_guideline_link: Schema.Attribute.String;
    sidebar_ads_cards_details: Schema.Attribute.Component<
      'text-field.sidebar-cards-details',
      true
    >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    thumbnail: Schema.Attribute.Media<'images' | 'files'>;
    visit_the_site_link: Schema.Attribute.String;
    with_deposit: Schema.Attribute.String & Schema.Attribute.Required;
    without_deposit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TextFieldSidebarCardsDetails extends Struct.ComponentSchema {
  collectionName: 'components_text_field_sidebar_cards_details';
  info: {
    displayName: 'sidebar cards details';
    icon: 'bulletList';
  };
  attributes: {
    details_title: Schema.Attribute.String;
  };
}

export interface TextFieldSlotFaq extends Struct.ComponentSchema {
  collectionName: 'components_text_field_slot_faqs';
  info: {
    description: '';
    displayName: 'Slot-faq';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface TextFieldSlotHistory extends Struct.ComponentSchema {
  collectionName: 'components_text_field_slot_histories';
  info: {
    description: '';
    displayName: 'Slot history';
  };
  attributes: {
    dealer: Schema.Attribute.String & Schema.Attribute.Required;
    player: Schema.Attribute.String & Schema.Attribute.Required;
    slot_result: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    slot_result_number: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    spin_hour: Schema.Attribute.DateTime & Schema.Attribute.Required;
    wheels_result: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    win_multiplier: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface TextFieldSpinCard extends Struct.ComponentSchema {
  collectionName: 'components_text_field_spin_cards';
  info: {
    description: '';
    displayName: 'Spin card';
  };
  attributes: {
    number: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    percentage: Schema.Attribute.Decimal & Schema.Attribute.Required;
    spin: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    successful: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    time_frame: Schema.Attribute.BigInteger;
    total: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    total_extractions: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface TextFieldVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_text_field_video_embeds';
  info: {
    description: 'Embed video content from various platforms';
    displayName: 'Video Embed';
    icon: 'video';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    controls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    description: Schema.Attribute.Text;
    muted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video_type: Schema.Attribute.Enumeration<
      ['youtube', 'vimeo', 'dailymotion', 'twitch', 'custom']
    > &
      Schema.Attribute.Required;
    video_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'text-field.primary-ads-card': TextFieldPrimaryAdsCard;
      'text-field.repeatable': TextFieldRepeatable;
      'text-field.sidebar-ads-cards': TextFieldSidebarAdsCards;
      'text-field.sidebar-cards-details': TextFieldSidebarCardsDetails;
      'text-field.slot-faq': TextFieldSlotFaq;
      'text-field.slot-history': TextFieldSlotHistory;
      'text-field.spin-card': TextFieldSpinCard;
      'text-field.video-embed': TextFieldVideoEmbed;
    }
  }
}
