import type { Schema, Struct } from '@strapi/strapi';

export interface TextFieldPrimaryAdsCard extends Struct.ComponentSchema {
  collectionName: 'components_text_field_primary_ads_cards';
  info: {
    description: '';
    displayName: 'Primary ads card';
    icon: 'chartBubble';
  };
  attributes: {
    link: Schema.Attribute.String;
    thumbnail: Schema.Attribute.Media<'images' | 'files'>;
    title: Schema.Attribute.Blocks;
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
    card_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    read_the_guideline_link: Schema.Attribute.String;
    sidebar_ads_cards_details: Schema.Attribute.Component<
      'text-field.sidebar-cards-details',
      true
    >;
    thumbnail: Schema.Attribute.Media<'images' | 'files'>;
    title: Schema.Attribute.Blocks;
    visit_the_site_link: Schema.Attribute.String;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'text-field.primary-ads-card': TextFieldPrimaryAdsCard;
      'text-field.repeatable': TextFieldRepeatable;
      'text-field.sidebar-ads-cards': TextFieldSidebarAdsCards;
      'text-field.sidebar-cards-details': TextFieldSidebarCardsDetails;
    }
  }
}
