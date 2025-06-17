import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiBlogAndNewsPageBlogAndNewsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'blog_and_news_pages';
  info: {
    description: '';
    displayName: 'Blog and news page';
    pluralName: 'blog-and-news-pages';
    singularName: 'blog-and-news-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured_blog: Schema.Attribute.Relation<'oneToOne', 'api::blog.blog'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-and-news-page.blog-and-news-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogBlog extends Struct.CollectionTypeSchema {
  collectionName: 'blogs';
  info: {
    description: '';
    displayName: 'blog';
    pluralName: 'blogs';
    singularName: 'blog';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    related_blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCasinoPageCasinoPage extends Struct.SingleTypeSchema {
  collectionName: 'casino_pages';
  info: {
    description: '';
    displayName: 'Casino page';
    pluralName: 'casino-pages';
    singularName: 'casino-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured_casino: Schema.Attribute.Relation<
      'oneToOne',
      'api::casino.casino'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::casino-page.casino-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCasinoCasino extends Struct.CollectionTypeSchema {
  collectionName: 'casinos';
  info: {
    description: '';
    displayName: 'casino';
    pluralName: 'casinos';
    singularName: 'casino';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    collaborations: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::casino.casino'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    related_casinos: Schema.Attribute.Relation<
      'oneToMany',
      'api::casino.casino'
    >;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCookiePolicyCookiePolicy extends Struct.SingleTypeSchema {
  collectionName: 'cookie_policies';
  info: {
    description: '';
    displayName: 'Cookie Policy';
    pluralName: 'cookie-policies';
    singularName: 'cookie-policy';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cookie-policy.cookie-policy'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFirstCountdownSectionFirstCountdownSection
  extends Struct.SingleTypeSchema {
  collectionName: 'first_countdown_sections';
  info: {
    description: '';
    displayName: 'First countdown section';
    pluralName: 'first-countdown-sections';
    singularName: 'first-countdown-section';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    button_text: Schema.Attribute.String;
    countdown: Schema.Attribute.DateTime & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::first-countdown-section.first-countdown-section'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGameTypeGameType extends Struct.CollectionTypeSchema {
  collectionName: 'game_types';
  info: {
    description: '';
    displayName: 'game type';
    pluralName: 'game-types';
    singularName: 'game-type';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::game-type.game-type'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slots: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGuideAndNewsPageGuideAndNewsPage
  extends Struct.CollectionTypeSchema {
  collectionName: 'guide_and_news_pages';
  info: {
    description: '';
    displayName: 'Guide and news page';
    pluralName: 'guide-and-news-pages';
    singularName: 'guide-and-news-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    featured_guide: Schema.Attribute.Relation<'oneToOne', 'api::guide.guide'>;
    guides: Schema.Attribute.Relation<'oneToMany', 'api::guide.guide'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::guide-and-news-page.guide-and-news-page'
    > &
      Schema.Attribute.Private;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGuidePageGuidePage extends Struct.SingleTypeSchema {
  collectionName: 'guide_pages';
  info: {
    description: '';
    displayName: 'Guide page';
    pluralName: 'guide-pages';
    singularName: 'guide-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured_guide: Schema.Attribute.Relation<'oneToOne', 'api::guide.guide'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::guide-page.guide-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGuideGuide extends Struct.CollectionTypeSchema {
  collectionName: 'guides';
  info: {
    description: '';
    displayName: 'guide';
    pluralName: 'guides';
    singularName: 'guide';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    guide_and_news_page: Schema.Attribute.Relation<
      'manyToOne',
      'api::guide-and-news-page.guide-and-news-page'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::guide.guide'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    related_guides: Schema.Attribute.Relation<'oneToMany', 'api::guide.guide'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomeFirstCtaHomeFirstCta extends Struct.SingleTypeSchema {
  collectionName: 'home_first_ctas';
  info: {
    description: '';
    displayName: 'Home First CTA';
    pluralName: 'home-first-ctas';
    singularName: 'home-first-cta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    button_enable: Schema.Attribute.Boolean;
    button_link: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::home-first-cta.home-first-cta'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    section_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomeSecondCtaHomeSecondCta extends Struct.SingleTypeSchema {
  collectionName: 'home_second_ctas';
  info: {
    description: '';
    displayName: 'Home Second CTA';
    pluralName: 'home-second-ctas';
    singularName: 'home-second-cta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    button_enable: Schema.Attribute.Boolean;
    button_link: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::home-second-cta.home-second-cta'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    section_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLiveStatisticLiveStatistic
  extends Struct.CollectionTypeSchema {
  collectionName: 'live_statistics';
  info: {
    description: '';
    displayName: 'Live statistics';
    pluralName: 'live-statistics';
    singularName: 'live-statistic';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::live-statistic.live-statistic'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    secondary_description: Schema.Attribute.RichText;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    spin_cards: Schema.Attribute.Component<'text-field.spin-card', true>;
    spin_histories: Schema.Attribute.Relation<
      'manyToMany',
      'api::spin-history.spin-history'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface ApiNewSlotNewSlot extends Struct.SingleTypeSchema {
  collectionName: 'new_slots';
  info: {
    description: '';
    displayName: 'New slots';
    pluralName: 'new-slots';
    singularName: 'new-slot';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::new-slot.new-slot'
    > &
      Schema.Attribute.Private;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsAndPreviewNewsAndPreview
  extends Struct.CollectionTypeSchema {
  collectionName: 'news_and_previews';
  info: {
    description: '';
    displayName: 'News and preview';
    pluralName: 'news-and-previews';
    singularName: 'news-and-preview';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-and-preview.news-and-preview'
    > &
      Schema.Attribute.Private;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    slots: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPokerPagePokerPage extends Struct.SingleTypeSchema {
  collectionName: 'poker_pages';
  info: {
    description: '';
    displayName: 'Poker page';
    pluralName: 'poker-pages';
    singularName: 'poker-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured_poker: Schema.Attribute.Relation<'oneToOne', 'api::poker.poker'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::poker-page.poker-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPokerPoker extends Struct.CollectionTypeSchema {
  collectionName: 'pokers';
  info: {
    description: '';
    displayName: 'poker';
    pluralName: 'pokers';
    singularName: 'poker';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::poker.poker'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    related_pokers: Schema.Attribute.Relation<'oneToMany', 'api::poker.poker'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPopUpPopUp extends Struct.SingleTypeSchema {
  collectionName: 'pop_ups';
  info: {
    displayName: 'Pop up';
    pluralName: 'pop-ups';
    singularName: 'pop-up';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::pop-up.pop-up'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    welcome_bonus_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
  };
}

export interface ApiPrivacyPolicyPrivacyPolicy extends Struct.SingleTypeSchema {
  collectionName: 'privacy_policies';
  info: {
    displayName: 'Privacy Policy';
    pluralName: 'privacy-policies';
    singularName: 'privacy-policy';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::privacy-policy.privacy-policy'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSearchBarPlaceholderSearchBarPlaceholder
  extends Struct.CollectionTypeSchema {
  collectionName: 'search_bar_placeholders';
  info: {
    displayName: 'Search bar placeholder';
    pluralName: 'search-bar-placeholders';
    singularName: 'search-bar-placeholder';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::search-bar-placeholder.search-bar-placeholder'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSecondCountdownSectionSecondCountdownSection
  extends Struct.SingleTypeSchema {
  collectionName: 'second_countdown_sections';
  info: {
    description: '';
    displayName: 'Second countdown section';
    pluralName: 'second-countdown-sections';
    singularName: 'second-countdown-section';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    button_text: Schema.Attribute.String;
    countdown: Schema.Attribute.DateTime & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::second-countdown-section.second-countdown-section'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSlotContentPageSlotContentPage
  extends Struct.CollectionTypeSchema {
  collectionName: 'slot_content_pages';
  info: {
    description: '';
    displayName: 'Slot content page';
    pluralName: 'slot-content-pages';
    singularName: 'slot-content-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::slot-content-page.slot-content-page'
    > &
      Schema.Attribute.Private;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    slots: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSlotPageSlotPage extends Struct.SingleTypeSchema {
  collectionName: 'slot_pages';
  info: {
    description: '';
    displayName: 'Slot page';
    pluralName: 'slot-pages';
    singularName: 'slot-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::slot-page.slot-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSlotProviderSlotProvider
  extends Struct.CollectionTypeSchema {
  collectionName: 'slot_providers';
  info: {
    description: '';
    displayName: 'Slot provider';
    pluralName: 'slot-providers';
    singularName: 'slot-provider';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::slot-provider.slot-provider'
    > &
      Schema.Attribute.Private;
    provider: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    provider_logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    provider_name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSlotThemeSlotTheme extends Struct.CollectionTypeSchema {
  collectionName: 'slot_themes';
  info: {
    description: '';
    displayName: 'slot-theme';
    pluralName: 'slot-themes';
    singularName: 'slot-theme';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::slot-theme.slot-theme'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slots: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSlotSlot extends Struct.CollectionTypeSchema {
  collectionName: 'slots';
  info: {
    description: '';
    displayName: 'slot';
    pluralName: 'slots';
    singularName: 'slot';
  };
  options: {
    draftAndPublish: true;
    populateCreatorFields: true;
  };
  attributes: {
    admin_users: Schema.Attribute.Relation<'oneToMany', 'admin::user'>;
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    casinos: Schema.Attribute.Relation<'oneToMany', 'api::casino.casino'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'>;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    description_ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    faq: Schema.Attribute.Component<'text-field.slot-faq', true>;
    game_link: Schema.Attribute.Text & Schema.Attribute.Required;
    game_type: Schema.Attribute.Relation<
      'manyToOne',
      'api::game-type.game-type'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'> &
      Schema.Attribute.Private;
    max_win: Schema.Attribute.Decimal;
    meta_description: Schema.Attribute.Text;
    meta_title: Schema.Attribute.String;
    news_and_preview: Schema.Attribute.Relation<
      'manyToOne',
      'api::news-and-preview.news-and-preview'
    >;
    pros: Schema.Attribute.RichText & Schema.Attribute.Required;
    provider: Schema.Attribute.Relation<
      'manyToOne',
      'api::slot-provider.slot-provider'
    >;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    related_slots: Schema.Attribute.Relation<'oneToMany', 'api::slot.slot'>;
    rtp: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
        },
        number
      >;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    sidebar_bonus_ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    slot_content_page: Schema.Attribute.Relation<
      'manyToOne',
      'api::slot-content-page.slot-content-page'
    >;
    slot_theme: Schema.Attribute.Relation<
      'manyToOne',
      'api::slot-theme.slot-theme'
    >;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'>;
    volatility: Schema.Attribute.Enumeration<['high', 'medium', 'low']>;
  };
}

export interface ApiSpinHistorySpinHistory extends Struct.CollectionTypeSchema {
  collectionName: 'spin_histories';
  info: {
    displayName: 'Spin history';
    pluralName: 'spin-histories';
    singularName: 'spin-history';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dealer: Schema.Attribute.String & Schema.Attribute.Required;
    live_statistics: Schema.Attribute.Relation<
      'manyToMany',
      'api::live-statistic.live-statistic'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::spin-history.spin-history'
    > &
      Schema.Attribute.Private;
    player: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slot_result: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    slot_result_number: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    spin_hour: Schema.Attribute.DateTime & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wheels_result: Schema.Attribute.BigInteger & Schema.Attribute.Required;
    win_multiplier: Schema.Attribute.BigInteger & Schema.Attribute.Required;
  };
}

export interface ApiSportPageSportPage extends Struct.SingleTypeSchema {
  collectionName: 'sport_pages';
  info: {
    description: '';
    displayName: 'Sport page';
    pluralName: 'sport-pages';
    singularName: 'sport-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featured_sports: Schema.Attribute.Relation<'oneToOne', 'api::sport.sport'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sport-page.sport-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.String;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSportSport extends Struct.CollectionTypeSchema {
  collectionName: 'sports';
  info: {
    description: '';
    displayName: 'sport';
    pluralName: 'sports';
    singularName: 'sport';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::sport.sport'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    related_sports: Schema.Attribute.Relation<'oneToMany', 'api::sport.sport'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    thumbnail: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTermsAndConditionTermsAndCondition
  extends Struct.SingleTypeSchema {
  collectionName: 'terms_and_conditions';
  info: {
    displayName: 'Terms and condition';
    pluralName: 'terms-and-conditions';
    singularName: 'terms-and-condition';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::terms-and-condition.terms-and-condition'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWelcomeBonusCardWelcomeBonusCard
  extends Struct.CollectionTypeSchema {
  collectionName: 'welcome_bonus_cards';
  info: {
    displayName: 'Welcome bonus card';
    pluralName: 'welcome-bonus-cards';
    singularName: 'welcome-bonus-card';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bg_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-card.welcome-bonus-card'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    text_color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    thumbnail: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    with_deposit: Schema.Attribute.String & Schema.Attribute.Required;
    without_deposit: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiWelcomeBonusPageWelcomeBonusPage
  extends Struct.SingleTypeSchema {
  collectionName: 'welcome_bonus_pages';
  info: {
    description: '';
    displayName: 'Welcome bonus page';
    pluralName: 'welcome-bonus-pages';
    singularName: 'welcome-bonus-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    ads_cards: Schema.Attribute.Component<'text-field.primary-ads-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus-page.welcome-bonus-page'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    section_description: Schema.Attribute.RichText & Schema.Attribute.Required;
    section_title: Schema.Attribute.String;
    sidebar_ads_cards: Schema.Attribute.Component<
      'text-field.sidebar-ads-cards',
      true
    >;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWelcomeBonusWelcomeBonus
  extends Struct.CollectionTypeSchema {
  collectionName: 'welcome_bonuses';
  info: {
    description: '';
    displayName: 'Welcome bonus';
    pluralName: 'welcome-bonuses';
    singularName: 'welcome-bonus';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::welcome-bonus.welcome-bonus'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    no_deposit: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    rating: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    visit_the_site_link: Schema.Attribute.String;
    with_deposit: Schema.Attribute.String;
  };
}

export interface ApiWhoWeAreWhoWeAre extends Struct.SingleTypeSchema {
  collectionName: 'who_we_ares';
  info: {
    description: '';
    displayName: 'who we are';
    pluralName: 'who-we-ares';
    singularName: 'who-we-are';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::who-we-are.who-we-are'
    > &
      Schema.Attribute.Private;
    meta_description: Schema.Attribute.Text;
    meta_keyword: Schema.Attribute.Component<'text-field.repeatable', true>;
    meta_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::blog-and-news-page.blog-and-news-page': ApiBlogAndNewsPageBlogAndNewsPage;
      'api::blog.blog': ApiBlogBlog;
      'api::casino-page.casino-page': ApiCasinoPageCasinoPage;
      'api::casino.casino': ApiCasinoCasino;
      'api::cookie-policy.cookie-policy': ApiCookiePolicyCookiePolicy;
      'api::first-countdown-section.first-countdown-section': ApiFirstCountdownSectionFirstCountdownSection;
      'api::game-type.game-type': ApiGameTypeGameType;
      'api::guide-and-news-page.guide-and-news-page': ApiGuideAndNewsPageGuideAndNewsPage;
      'api::guide-page.guide-page': ApiGuidePageGuidePage;
      'api::guide.guide': ApiGuideGuide;
      'api::home-first-cta.home-first-cta': ApiHomeFirstCtaHomeFirstCta;
      'api::home-second-cta.home-second-cta': ApiHomeSecondCtaHomeSecondCta;
      'api::live-statistic.live-statistic': ApiLiveStatisticLiveStatistic;
      'api::new-slot.new-slot': ApiNewSlotNewSlot;
      'api::news-and-preview.news-and-preview': ApiNewsAndPreviewNewsAndPreview;
      'api::poker-page.poker-page': ApiPokerPagePokerPage;
      'api::poker.poker': ApiPokerPoker;
      'api::pop-up.pop-up': ApiPopUpPopUp;
      'api::privacy-policy.privacy-policy': ApiPrivacyPolicyPrivacyPolicy;
      'api::search-bar-placeholder.search-bar-placeholder': ApiSearchBarPlaceholderSearchBarPlaceholder;
      'api::second-countdown-section.second-countdown-section': ApiSecondCountdownSectionSecondCountdownSection;
      'api::slot-content-page.slot-content-page': ApiSlotContentPageSlotContentPage;
      'api::slot-page.slot-page': ApiSlotPageSlotPage;
      'api::slot-provider.slot-provider': ApiSlotProviderSlotProvider;
      'api::slot-theme.slot-theme': ApiSlotThemeSlotTheme;
      'api::slot.slot': ApiSlotSlot;
      'api::spin-history.spin-history': ApiSpinHistorySpinHistory;
      'api::sport-page.sport-page': ApiSportPageSportPage;
      'api::sport.sport': ApiSportSport;
      'api::terms-and-condition.terms-and-condition': ApiTermsAndConditionTermsAndCondition;
      'api::welcome-bonus-card.welcome-bonus-card': ApiWelcomeBonusCardWelcomeBonusCard;
      'api::welcome-bonus-page.welcome-bonus-page': ApiWelcomeBonusPageWelcomeBonusPage;
      'api::welcome-bonus.welcome-bonus': ApiWelcomeBonusWelcomeBonus;
      'api::who-we-are.who-we-are': ApiWhoWeAreWhoWeAre;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
