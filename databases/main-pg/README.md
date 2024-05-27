# DB Migrations

> Full information on [Notion](https://www.notion.so/yuccadigital/Migrations-aea7924de34a40158023d6d7ac3d40b8)

# Migrations

## New

- `cd databases/satan`
- `npm run migration:create --name=<name>`
- write new migration
- `npm run migration:up`

# Fixtures

## New

- `cd databases/satan`
- `npm run fixture:create --name=<name>`
- `npm run fixture:up`

## Update current

Update needed fixture files time prefix (for example: 20230430080211-event-notification-setting-down.sql) to new one (for example: 20230430080212-event-notification-setting-down.sql) and run `npm run fixture:up`

- `cd databases/satan/fixtures`
- `mv <time-prefix>-<name>.js <NEW-time-prefix>-<name>.js`
- `cd sqls`
- `mv <time-prefix>-<name>-up.sql <NEW-time-prefix>-<name>-up.sql `
- `mv <time-prefix>-<name>-down.sql <NEW-time-prefix>-<name>-down.sql `
- `npm run fixture:up`

# DB structure

- (integration) – integration with external service
- (can be legacy) – can be removed in future
- (util) – util table
- (added by fixtures) – added by fixtures

## Tables

- `AdsCampaignTable` – eversys ads campaign (integration)
- `AdsImageTable` – eversys ads images (integration)
- `BelblankavidCashboxTable` – belblankavid specific cashbox (integration)
- `BillingProviderStripeTable` – ???
- `BillingProviderTinkoffTable` – ???
- `BillingTariffTable` – ???
- `CashboxTable` common cashbox data
- `CashboxControllerTable` – relation between cashbox and controller
- `CollaboratorTable` – relation between user, role and organization
- `CollaboratorControllerTable` – what controllers collaborator can use
- `ControllerTable` – controller main data
- `ControllerCommandTable` – commands for controller
- `ControllerConfigCoffeeTable` – coffee controller config (config can be sent by controller or server)
- `ControllerConfigImpulseTable` – impulse controller config (config can be sent by controller or server)
- `ControllerConnectionTable` – current controller connection information (can be legacy)
- `ControllerControllerFeatureTable` – relation between controller and controller feature
- `ControllerDowntimeTable` – dowtime history data
- `ControllerEventTable` – controller events
- `ControllerEventMappingTable` – mapping between controller message tags and events (added by fixtures)
- `ControllerEversysAuthEncryptionKeyTable` – auth key for eversys (can be legacy)
- `ControllerFeatureTable` – features for controller (added by fixtures)
- `ControllerInfoTable` – common controller info
- `ControllerIoMessageTable` – debug purpose controller messages log
- `ControllerMatrixTable` – product matrix for controller
- `ControllerMatrixProductTable` – relation between controller matrix and product
- `ControllerMatrixResourceTable` – relation between controller matrix products and resource
- `ControllerMatrixTemplateTable` – controller matrix templates to create matrix
- `ControllerMatrixTemplateProductTable` – relation between controller matrix template and product
- `ControllerMatrixTemplateResourceTable` – relation between controller matrix template product and resource
- `ControllerOrganizationTable` – relation between controller and organization
- `ControllerProcessingFailReasonTable` – ???
- `ControllerResourceRefillTable` – ???
- `ControllerRtcCoffeeTable` – rtc coffee controller
- `ControllerRtcDeltaCoffeeTable` – rtc delta coffee controller
- `ControllerRtcDeltaImpulseTable` – rtc delta impulse controller
- `ControllerRtcImpulseTable` – rtc impulse controller
- `ControllerStateCoffeeTable` – controller state for coffee controller (only sent by controller)
- `ControllerStateImpulseTable` – controller state for impulse controller (only sent by controller)
- `ControllerTagLogTable` – when and what tags has been sent by controller
- `ElautConfigTable` – elaut current config (integration)
- `ElautConfigHistoryTable` – elaut config history (integration)
- `EncashmentTable` – encashment history
- `EventNotificationTable` – event notification history
- `EventNotificationControllerScheduleTable` – event notification schedule for controller
- `EventNotificationSettingTable` – event notification settings
- `EventNotificationUserSettingTable` – event notification user settings
- `FirebaseCollaboratorTokenTable` – firebase tokens for collaborator (integration)
- `FiscalizationInstanceTable` – fiscalization instance (can be legacy)
- `FiscalizationInstanceCashboxBindingTable` – relation between fiscalization instance and cashbox (integration)
- `FiscalizeSaleTable` – fiscalize sale jobs
- `FixtureTable` – fixtures (util)
- `GroupTable` – groups
- `GroupControllerTable` – relation between group and controller
- `InviteTable` – user invites
- `InviteControllerTable` – relation between invite and controller
- `InvoiceBillingControllersUsedTable` – controller that has been used and must be paid
- `InvoiceBillingTinkoffTable` – invoice for Tinkoff billing provider (integration)
- `InvoiceQrTable` – invoice for QR billing provider
- `InvoiceQrMoneiTable` – invoice for Money billing provider
- `MigrationsTable` – migrations (util)
- `MoneiPaymentProcessingTable` – payment processing for Money billing provider (integration)
- `NanokassaCashboxTable` – nanokassa specific cashbox (integration)
- `OrangedataCashboxTable` – orangedata specific cashbox (integration)
- `OrganizationTable` – organization main data
- `OrganizationControllerUsageTable` – relation between organization and controller
- `OrganizationFeatureTable` – organization features (added by fixtures)
- `OrganizationInfoTable` – organization info
- `OrganizationKeyAccessTable` – ???
- `OrganizationOrganizationFeatureTable` – relation between organization and organization feature
- `OrganizationPaymentProviderMbwayTable` – mbway payment provider (integration)
- `OrganizationPaymentProviderMoneiTable` – monei payment provider (integration)
- `OrganizationPaymentProviderOplatiTable` – oplati payment provider (integration)
- `OrganizationPaymentProviderTinkoffSbpTable` – tinkoff sbp payment provider (integration)
- `OrganizationSubscriptionTable` – organization subscription
- `PaymentProviderMoneiPointOfSaleTable` – monei point of sale (integration)
- `ProductTable` – organization product main data
- `ProductProductResourceTable` – relation between product and product resource
- `ProductResourceTable` – product resource data
- `RedeployEventTable` – redeploy events (for showing on client)
- `SaleTable` – sale history
- `SaleProductTable` – product in sale
- `SaleProductResourceTable` – resource in sale product
- `SubscriptionBillingProviderTable` – relation between subscription and billing provider
- `SubscriptionUnitUsageHistoryTable` – subscription unit usage history
- `TinkoffBillingOrganizationCardsTable` – organization cards for Tinkoff billing provider (integration)
- `TinkoffSbpPaymentProcessingTable` – payment processing for Tinkoff SBP billing provider (integration)
- `UserTable` – user main data
- `UserInfoTable` – user info
- `UserSessionTable` – user session
- `UserSuperRoleTable` – for super-user role