# Example Pattern Library

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

### Requirements

- NodeJS (Recommended 6.11.3)
- npm (Recommended 3.10.10)

# About

This pattern library makes heavy use of of Gulp build processes and Pug to ensure consistency as well as streamline the development and management of pages as quickly as possible. See the following sections for more details on working within this framework:

### Table of Contents:

- [Install](#install)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
  - [Staging](#staging)
- [Directories](#directories)
- [Assets](#assets)
  - [Pattern Library](#pattern-library)
  - [Toolkit](#toolkit)
- [Content](#content)
  - [Navigation (Sidebar and Footer)](#navigation)
  - [Header/Metadata](#header-metadata)
  - [Preview Blocks](#preview-blocks)
  - [Color Palettes & Icon Blocks](#color-icons)
  - [Typography Blocks](#typography-blocks)

# Getting Started

## Install

```command
# Load Packages
npm start
```

## Usage

### Development:

To generate a live testing environment and development friendly code, run the following command:

```command
# run everything on development mode (source maps, expanded, etc.)
gulp
```

By default localhost is served up at http://localhost:8000/ and will automatically live reload on content changes.

### Production:

To generate production ready code, run the following command:

```command
# run everything on production mode (uglified, gzipped, etc.)
gulp --prod
```

### Staging (Github Page):

To generate a GitHub Page, run the following command:

```command
# compile and automatically export to github pages
gulp deploy
```

# Directories

All work is done in the `src` directory which contains the following directories:

```
└── src
    ├── assets
    ├── favicons
    ├── svg
    └── views
```

# Assets

Digging through the `src/assets` directory, you'll notice that the site is broken into two distinct sections, Pattern Library, and Toolkit, which both contain their own unique `scripts` and `styles`.

---

## Pattern Library

Pattern Library is the driver behind the overall pattern library theme. It handles all of the theme styles and interactions such as typography, color, layout, and responsiveness. Any modifications to the theme should be done so here!

##### NOTE: All classes within here are prefixed with `pl-` so as to not interfere with any of the toolkit stylings/rules.

## Toolkit

Toolkit is where styles and scripts relating to the actual preview code snippets lives. For example, if you had the following in your `previewCode` snippet:

```
<button type="button" class="btn btn-primary">Primary</button>
```

The styling and scripts associated with styling that component are what should live inside of the toolkit.

Avoid using `toolkit` for anything other than preview content.

##### NOTE: Read more about `previewCode` in the [Preview Blocks](#preview-blocks) section.

# Content

Pug is the driving framework behind the way in which pages are generated through the use of `mixins`. Any changes that need to be made to the mixins themselves can be found within the `src/views/includes` directory.

---

## Navigation (Sidebar/Footer)

The Pattern Library builds the navigation (both sidebar and footer) based on the `src/views/categories` directory.

Example navigation taxonomy:

```
└── categories
    └── category
        └── page
```

Input:

```
└── categories
    ├── 00 - Introduction
        └── UX-Principles.pug
    ├── 01 - Style Guide
        ├── Color.pug
        ├── Hierarcy-of-Space.pug
        ├── Iconography.pug
        └── Typography.pug
    └── 02 - Components
```

Output:

![image](https://user-images.githubusercontent.com/8878152/40804839-728533c8-64ea-11e8-826c-6b3286503e00.png)

Sections, such as '00 - Introduction' and '01 - Style Guide', are actually sidebar category titles with the ordering of these sections being handled by placing a number followed by a dash (-) with **spaces on both sides of it**.

Pages, such as `Color.pug` and `Hierarchy-of-Space.pug` must both be **Case Sensitive** and use dashes (-) for spaces. The reason for this is that there are instance where you may want multiple words to be all caps, such as 'UX' in 'UX Principles', or 'WYSIWYG' in 'WYSIWYG Editor'. The Gulp build process will clean up these page names to ensure that the `html` files are all lowercase and stripped of any illegal characters.

##### IMPORTANT: Any changes made, such as renaming, deleting, or creating sidebar content, requires restarting gulp in order to be reflected since the sidebar is generated on runtime.

---

## Header/Metadata

Each page has a few variables at the top, first of which is a `title` and `description` variable that will allow modifying of the page metadata as needed.

In addition, each page also contains an `intro` variable which takes in the strings for both `header` and `copy` and builds the intro header for each page.

---

## Preview Blocks

The core mixin for building the content of most pages is `pattern-preview-block` which takes in the following parameters:

```js
    hasMobile, // boolean
    codeSnippet, // string (leave empty if none)
    desktopImages, // array (leave empty if none)
    mobileImages, // array (leave empty if none)
    previewBgColor: 'white' // string ('white' [default] || 'offwhite' || 'gray')
```

These parameters are contained within an object variable `blockContent` and is modified prior to each subsection within a page.

Example Input:

```pug
-
    var blockContent = {
    hasMobile: true,
    // keep the following tab index so that spacing is true to markup
    previewCode:
    `<!-- Example Primary Button -->
    <button type="button" class="btn btn-primary">Primary</button>
    `,
    desktopImages: [
        {
            image: '',
            imageDescription: ''
        }
    ],
    mobileImages: [
        {
            image: '',
            imageDescription: ''
        }
    ],
    previewBgColor: 'white' //- (white [default], offwhite, gray)
    }

+pattern-preview-block(blockContent.hasMobile, blockContent.previewCode, blockContent.desktopImages, blockContent.mobileImages, blockContent.previewBgColor)
```

Example Output:

![image](https://user-images.githubusercontent.com/8878152/35453341-d2e3f43a-0297-11e8-8c4c-0205128035cc.png)

This will auto generate a section based on the data passed in `blockContent`.

##### IMPORTANT: The `previewCode` string should maintain the left-most tab-index relative to the variable so as to not arbitrarily tab incorrectly on the code output. Failure to adhere by this may result in some funky tabbing of your preview code snippet within the component on the page.

For information regarding styling of the code preview, see [Code Preview](#code-preview).

---

## Color Palettes & Icon Blocks

Color palettes and icons make use of their own, simple mixin for generating content.

Color Input:

```pug
// (<Color Name>, <Color Hex Value>)
+pattern-color('Primary Blue', '#2199F4')
```

Color Output:

![image](https://user-images.githubusercontent.com/8878152/35453143-1d25bdae-0297-11e8-87fb-b37f7b96c600.png)

Icon Input:

```pug
// (<Subsection Name>, <Icon Name>)
+pattern-icon('actions', 'add.svg')
```

Icon Output:

![image](https://user-images.githubusercontent.com/8878152/35453170-3353ec68-0297-11e8-93de-8172203c146d.png)

##### NOTE: Icons take in the `Subesection Name` parameter because of the folder structure of icons -- `icons/actions/add.svg`.

---

## Typography Blocks

Similar to Color Palettes & Icons, Typography makes use of its own mixin for generating content.

Input:

```pug
+pattern-typography(
    //- Typography Type
    'Headline',
    //- Basic Properties
    ['Font size: 28px',
    'Font weights: 400/Regular and 700/Bold',
    'Line height: 36px',
    'Colors: Primary Blue, Black, White, Gray 1, Gray 3'],
    //- Suggested Usage
    ['Page level headlines and short text']
)
```

Output:

![image](https://user-images.githubusercontent.com/8878152/35453076-d9562db6-0296-11e8-8f09-7306b9f0e115.png)
