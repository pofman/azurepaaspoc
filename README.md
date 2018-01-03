# Azure Platform as a Service (Proof of concept)

## Intro
The objective of this project is to test Azure resource manager with templates and some automated deployments

## Prerequisites
* Yarn
* Azure Cli

## Installation

### Please remember to install yarn packages
`cd AzurePaasPOC.Web/wwwroot`
`yarn run libinstall`

### Then deploy azure resources 
1. Login to azure
`Login-AzureRmAccount`
2. Run script in Azure resources project
`cd AzurePaaSPOC.AzureResources`
`.\Deploy-AzureResourceGroup.ps1 -ResourceGroupLocation "North Central US"`

Note: Specify resource group name if your account is not allowed to create resoruce groups

### Deploy web app into App service
1. Go to azure portal and `Get publish profile` from the app service
2. Import the profile into the web project and `PUBLISH`
