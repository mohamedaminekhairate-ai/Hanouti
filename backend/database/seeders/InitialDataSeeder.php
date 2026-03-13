<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Delivery;
use App\Models\Loss;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Categories
        $categories = [
            ['name' => 'ألبان', 'icon' => '🥛'],
            ['name' => 'مشروبات', 'icon' => '🥤'],
            ['name' => 'خبز', 'icon' => '🍞'],
            ['name' => 'معلبات', 'icon' => '🫙'],
            ['name' => 'حبوب', 'icon' => '🥣'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }

        // 2. Suppliers
        $suppliers = [
            ['name' => 'سنطرال', 'phone' => '0522000000', 'address' => 'الدار البيضاء'],
            ['name' => 'كوكا كولا', 'phone' => '0522111111', 'address' => 'عين السبع'],
            ['name' => 'لافاش كيري', 'phone' => '0522222222', 'address' => 'طنجة'],
        ];

        foreach ($suppliers as $sup) {
            Supplier::updateOrCreate(['name' => $sup['name']], $sup);
        }

        // 3. Products
        $catDairy = Category::where('name', 'ألبان')->first();
        $catDrinks = Category::where('name', 'مشروبات')->first();
        $supCentral = Supplier::where('name', 'سنطرال')->first();
        $supCoca = Supplier::where('name', 'كوكا كولا')->first();

        $products = [
            [
                'name' => 'حليب سنطرال',
                'category_id' => $catDairy->id,
                'supplier_id' => $supCentral->id,
                'buy_price' => 5.5,
                'sell_price' => 7,
                'stock' => 24,
            ],
            [
                'name' => 'كوكا كولا كبيرة',
                'category_id' => $catDrinks->id,
                'supplier_id' => $supCoca->id,
                'buy_price' => 6,
                'sell_price' => 8,
                'stock' => 30,
            ],
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['name' => $prod['name']], $prod);
        }

        // 4. Customers
        $customers = [
            ['name' => 'سي محمد', 'debt' => 150, 'phone' => '0661000000'],
            ['name' => 'لالة فاطمة', 'debt' => 75.5, 'phone' => '0661111111'],
            ['name' => 'با أحمد', 'debt' => 0, 'phone' => '0661222222'],
        ];

        foreach ($customers as $cust) {
            Customer::updateOrCreate(['name' => $cust['name']], $cust);
        }

        // 5. Deliveries (Mock some recent ones)
        $prodMilk = Product::where('name', 'حليب سنطرال')->first();
        $delivery = Delivery::create([
            'supplier_id' => $supCentral->id,
            'product_id' => $prodMilk->id,
            'quantity' => 48,
            'buy_price' => 5.5,
            'date' => now(),
            'status' => 'received'
        ]);

        // 6. Losses
        Loss::create([
            'product_id' => $prodMilk->id,
            'quantity' => 2,
            'reason' => 'صلاحية سالات',
            'date' => now()
        ]);
    }
}
