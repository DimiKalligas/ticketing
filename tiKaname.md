από Dave Gray https://www.youtube.com/watch?v=djDgTYrFMAY&list=PLPfcmcDlsjWvJWK2i5IrTUMmjZe9Ozd9f&index=5

login με **jim@email.com 123**

# background image
το βάλαμε ως bg-home-img (ή bg-background?) στο tailwind.config.ts

# Dark Theme
από ShadCN, παίζει με ThemeProvider με το οποίο κάνουμε wrap το root layout, σώζει στο localStorage, έχουμε τα <ModeToggle> & <ui/dropdown-menu> components από ShadCN

# tailwind.config.css
1. ορίσαμε το background: βάλαμε ως <bg-home-img>
2. αφαίρεσα τα <animate-slide> & <animate-appear>: τα keyframes & το animation

# animation
smooth entrance animation from shadcn's animation utilities στο <app\(ts)\template> & στο <Header>

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
κάναμε `npm i @kinde-oss/kinde-auth-nextjs @kinde/management-api-js`, το δεύτερο είναι για διαχείριση χρηστών -> χρειάζεται να κάνουμε Add application στο kinde -> Machine-to-machine, Applications -> API -> ...Authorize application, ...Manage scopes -> read:users
Στο <CustomerForm> βλέπουμε αν ο customer είναι Manager & τότε μόνο μπορεί να κάνει ενα record inactive - στις <CustomerForm> & <ΤicketFormPage> βλέπουμε πως παίρνουμε τα user rights από το kinde
Θυμίσου: στο kinde ορίσαμε σε ποιά σελίδα κάνει landing μετά το log-in.
μας δίνει από server  <const { isAuthenticated } = getKindeServerSession()
            const isAuth = await isAuthenticated()>
        από client  <const { getPermission, isLoading } = useKindeBrowserClient()
                    const isManager = !isLoading && getPermission('manager')?.isGranted>

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

# Flow: 
login: αν τα formData ταιριάζουν με τον καρφωτό testUser, σώζουμε session με το id?? του user
εχουμε μια σελίδα που διαβάζει από τα searchParams ποιόν πελάτη θέλουμε, πάει και βρίσκει τα στοιχεία του, και καλεί μια φόρμα η οποία είτε κάνει populate τα πεδία με τις τιμές που τις στέλνουμε, ή αλλιώς βάζει τα default values (κενά) -> Αναλυτικά:
όταν ζητάμε `http://localhost:3000/customers/form?customerId=4` 
- τρέχει η <src\app\(ts)\customers\form\CustomerFormPage({searchParams})>
- καλεί το <getCustomer> query
- αν τον βρει: κάνει return <CustomerForm customer={customer}/> **EDIT**
- αν δεν τον βρει: κάνει return <CustomerForm />
- <CustomerForm />: λόγω <defaultValues> θα δείξει ή τον customer, η κενό

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
ο κώδικας πριν το pagination είναι στο video 10

# Από Kinde σε Jose
uninstall @kinde-oss/kinde-auth-nextjs
remove env vars
remove API endpoint src/app/api/auth/[kindeauth]/route.js
uninstall @kinde-oss/kinde-auth-nextjs/components
To login γίνεται στο src/app/login/page: πλέον δουλεύει με το </actions>
setup <@/lib/session.ts>
install jose
*** Θα πρέπει να έχω Admin / Manager / User roles **

> TO DO (CTRL-K V)
[] Customer's form -> στο onclick -> Edit Customer / New Ticket
3. [] να δω ποιά <Form> για το login (see: next.js Form)
3. [] το middleware κοιτάει απλώς αν υπάρχει session..
4 [ ] να δω docs routing > error handling
5. [ ] να δουλέψω το InputWithLabel σε δικό μου project
5. [] να δω το Data Access Layer
6. [ ] γιατί χρησιμοποιεί const form = useFormContext() αντί για useForm()?
    - useForm() is used to initialize a new form and is typically used in the parent component.
    - useFormContext() is useful in large forms with multiple child components, avoiding unnecessary prop drilling.
8. [ ] να κάνω τα CustomerSearch & TicketSearch ΕΝΑ reusable component!
10. [x] Ticket Table: αν auth: να γίνεται 
    7.1 [ ] edit το notes πεδίο μέσα στον πίνακα (με EditableCell αλά React Table Tutorial (TanStack Table) Nikita) 
    7.2 [ ] και dropdown menu για το tech
    7.3 [x] να παίρνει το light/dark από το theme = read localStorage theme
11. [χ] να δω πάλι γιατί έχουμε 2 schemas (στο zod\schemas & στο lib/queries/ db\schema?)
    στο <zod\schemas> έχουμε τα drizzle schemas (createInsert & createSelect που προσθέτουνε regex & μήνυμα λάθους πάνω στο reference to db schema, το οποίο χρειάζεται άσχετα αν εδώ το τροποποιούμε κιόλας!)
12. Που χρειάζονται τα DisplayServerActionResponse, upsertTicket & upsertCustomer?
[x] να ξηλώσω το kinde & να γίνει με Jose-JWT
[x] να φτιάξω τη app\login\page ξανά
[x] οι users να μπουν στη βάση -> όπου testUser να κοιτάω βάση (κοίτα \src\lib\queries\getCustomer.ts)
[x] να φτιάξω τη φόρμα του ticket: ./src/app/(ts)/tickets/form/page.tsx 
[x] η ticket form να διαβάζει role = o admin & ο ίδιος user μπορούν να κάνουν edit
[x] RBAC = διαβάζω το role από το user object
9 [x] να φύγει το tanstack table & να μπει AG Grid - λύνει και τα επόμενα:

