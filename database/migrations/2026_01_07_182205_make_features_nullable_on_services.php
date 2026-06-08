<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasColumn('services', 'features')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE services ALTER COLUMN features DROP NOT NULL');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE services MODIFY features JSON NULL');
        }
    }
};
