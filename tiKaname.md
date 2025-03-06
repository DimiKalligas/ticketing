από Dave Gray https://www.youtube.com/watch?v=djDgTYrFMAY&list=PLPfcmcDlsjWvJWK2i5IrTUMmjZe9Ozd9f&index=5

# background image
το βάλαμε ως bg-home-img (ή bg-background?) στο tailwind.config.ts

# tailwind.config.css
1. ορίσαμε το background: βάλαμε ως <bg-home-img>
2. ορίσαμε τa <animate-slide> & <animate-appear>: τα keyframes & το animation

# animation
αρχικά το βάλαμε στο <app\(ts)\template>

# Tailwind
flex flex-col sm:flex-row για adaptive

# reusable Button component
στο components\NavButton.tsx

# error handling
βάλαμε τα <error.tsx> στο (ts) & <global-error> στο root, as per NextJS

# kinde auth
κοίτα https://www.youtube.com/watch?v=GjVcSpKCoB8
κάναμε connect to existing codebase
στον production αλλάζουμε το callback 
set SSO session inactivity timeout to 604800 (Monday to Friday)
κάνουμε Add User

# drizzle
για να κάνουμε αλλαγές στη βάση, πρώτα: generate -> μετά: migrate
npm run db:generate φτιάχνει το schema 
npm run db:migrate στέλνει τις αλλαγές
Ορίσαμε το schema της βάσης στο src\db\schema.ts --- και το κάναμε extend για form validation στην CustomerForm με <createInsertSchema(customers, zod_schema)> οπου το ονομάσαμε insertCustomerSchema
Η βάση μας βρίσκεται στο https://console.neon.tech/app/projects/frosty-shadow-10196118?database=neondb

# Data Access Layer (DAL)
Οι άλλες μέθοδοι για να διαβάσουμε data είναι επικίνδυνοι:
1. Στο server component (page μέσα στο \app) ελέγχουμε αν auth(), και μετά καλούμε το component -> οπότε μπορεί κάποιος άλλος _να καλέσει αυτό το component χωρίς να ελέγξει για auth.._
2. με middleware: πάλι μπορώ να καλέσω το component από public-access σελίδα (π.χ. να κάνω match το \article, αλλά να το καλέσω από public route)
3. μέσω server actions = ^ το ίδιο
To DAL μας βρίσκεται στα <app\(ts)\customers\form> & <app\(ts)\tickets\form>

# React Hook Form

# Typescript
<type> preffered over <interface>

Όλο το application είναι στο (ts) folder
H `<layout>` καλεί την `<Header>` -> H `<Header>` έχει `NavButton` για routing
To **Data layer** για customer data είναι στο `E:\dev\NextJS\ticketing\src\app\(ts)\customers\form\page.tsx`
Flow: 
εχουμε μια σελίδα που διαβάζει από τα searchParams ποιόν πελάτη θέλουμε, πάει κατ βρίσκει τα στοιχεία του, και καλεί μια φόρμα η οποία είτε κάνει populate τα πεδία με τις τιμές που τις στέλνουμε, ή αλλιώς βάζει τα default values (κενά) -> Αναλυτικά:
όταν ζητάμε `http://localhost:3000/customers/form?customerId=4` 
- τρέχει η <src\app\(ts)\customers\form\CustomerFormPage({searchParams})>
- καλεί το <getCustomer> query
- αν τον βρει: κάνει return <CustomerForm customer={customer}/> **EDIT**
- αν δεν τον βρει: κάνει return <CustomerForm />
- <CustomerForm />: λόγω <defaultValues> θα δείξει ή τον customer, η κενό

# kinde
κάναμε npm i @kinde-oss/kinde-auth-nextjs @kinde/management-api-js, το δεύτερο είναι για διαχείριση χρηστών -> χρειάζεται να κάνουμε Add application στο kinde -> Machine-to-machine, Applications -> API -> ...Authorize application, ...Manage scopes -> read:users
Στο CustomerForm βλέπουμε αν ο customer είναι Manager & τότε μόνο μπορεί να κάνει ενα record inactive - στις CustomerForm & ΤicketFormPage βλέπουμε πως παίρνουμε τα user rights από το kinde
Θυμίσου: στο kinde ορίσαμε σε ποιά σελίδα κάνει landing μετά το log-in.

# Form Validation
- client: const form = useForm<insertCustomerSchemaType>
- server: 1.const parsed = insertCustomerSchema.safeParse(formData)
            2. Τα constraints τα πιάνει αφού πάει να σώσει -> θέλei try/catch στη await db.insert & db.update
αν θέλω banner, να δω την DisplayServerActionResponse

# Search flow
- η σελίδα των customers είναι server action που δέχεται searchParams
- αυτή παίρνει results από μια function που ψάχνει τη βάση με τα searchParams
- και κάνει return 
    1. ένα input πεδίο φόρμας που καλεί το ίδιο server action με τα searchParams (το όνομα του input)
    2. τα results
- partial & flexible searches: δες <searchDBforCus>

# Header navigation
Κοίτα <components\Header> & <components\NavButtonMenu>

# Pagination
ο κώδικας πριν το pagination είναι στο 10

> TO DO (CTRL-K V)
0.0 Αρχική Customers=empty Αρχική tickets=all να το δω
0. Όταν κάνω edit ticket -> κολλάει στο updating
    Οταν κάνω update customer -> δεν κάνει redirect στους customers..
1. [ ] να δω docs routing > error handling
2. [ ] να δουλέψω το InputWithLabel σε δικό μου project
3. [ ] γιατί χρησιμοποιεί const form = useFormContext() αντί για useForm()?
    - useForm() is used to initialize a new form and is typically used in the parent component.
    - useFormContext() is useful in large forms with multiple child components, avoiding unnecessary prop drilling.
4. [ ] τo kinde management (διαχείριση χρηστών) πως γίνεται με Auth.js? RBAC
5. [ ] να κάνω τα CustomerSearch & TicketSearch ΕΝΑ reusable component!
6.1 [ ] να φύγει το tanstack table & να μπει AG Grid - λύνει και τα επόμενα:
6. [ ] να γίνεται edit το notes πεδίο μέσα στον πίνακα (με EditableCell αλά React Table Tutorial (TanStack Table) Nikita) ή και dropdown menu για το tech π.χ.
