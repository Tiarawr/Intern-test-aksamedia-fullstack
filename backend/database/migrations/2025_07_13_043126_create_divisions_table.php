<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDivisionsTable extends Migration
{
    public function up()
    {
        Schema::create('divisions', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Name of the division
            $table->timestamps(); // Created at and updated at columns
        });
    }

    public function down()
    {
        Schema::dropIfExists('divisions');
    }
}
