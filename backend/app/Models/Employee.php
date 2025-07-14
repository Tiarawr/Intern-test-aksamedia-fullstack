<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // Define the table name if it's different from the plural of the model name
    protected $table = 'employees';

    // Define the fillable fields
    protected $fillable = [
        'image',
        'name',
        'phone',
        'division_id',
        'position',
    ];

    // Define any relationships (example: employee belongs to division)
    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
