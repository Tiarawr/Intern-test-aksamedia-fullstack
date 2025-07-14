<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    use HasFactory;

    // Specify the table name (optional if you want to use a different name)
    protected $table = 'divisions';

    // Specify the fillable fields
    protected $fillable = [
        'name',
    ];
}
