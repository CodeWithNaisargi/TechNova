# Assignment System API Test Script
# Run this in PowerShell to test all assignment progress endpoints

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Assignment System API Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$base = "http://localhost:5001"

# Test 1: Login
Write-Host "Test 1: Login as Student" -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod "$base/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"student1@lms.com","password":"student123"}' `
        -SessionVariable session
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Role: $($loginResponse.user.role)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 2: Get Courses
Write-Host "Test 2: Get Available Courses" -ForegroundColor Yellow
try {
    $coursesResponse = Invoke-RestMethod "$base/api/courses" -Method GET
    $courseCount = $coursesResponse.data.Count
    Write-Host "✅ Found $courseCount courses" -ForegroundColor Green
    
    if ($courseCount -gt 0) {
        $firstCourse = $coursesResponse.data[0]
        $courseId = $firstCourse.id
        Write-Host "   First course: $($firstCourse.title)" -ForegroundColor Gray
        Write-Host "   Course ID: $courseId" -ForegroundColor Gray
    } else {
        Write-Host "❌ No courses found!" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "❌ Failed to get courses: $_" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 3: Enroll in Course
Write-Host "Test 3: Enroll in Course" -ForegroundColor Yellow
try {
    $enrollResponse = Invoke-RestMethod "$base/api/student/enroll" `
        -Method POST `
        -ContentType "application/json" `
        -Body "{`"courseId`":`"$courseId`"}" `
        -WebSession $session
    
    Write-Host "✅ Enrollment successful!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️  Already enrolled (that's okay)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Enrollment failed: $_" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Get Course Assignments
Write-Host "Test 4: Get Course Assignments" -ForegroundColor Yellow
try {
    $assignmentsResponse = Invoke-RestMethod "$base/api/assignments/courses/$courseId/assignments" `
        -Method GET `
        -WebSession $session
    
    $assignmentCount = $assignmentsResponse.data.Count
    Write-Host "✅ Found $assignmentCount assignments" -ForegroundColor Green
    
    if ($assignmentCount -gt 0) {
        $firstAssignment = $assignmentsResponse.data[0]
        $assignmentId = $firstAssignment.id
        Write-Host "   Assignment 1: $($firstAssignment.title)" -ForegroundColor Gray
        Write-Host "   Status: $($firstAssignment.status)" -ForegroundColor Gray
        Write-Host "   Completed: $($firstAssignment.isCompleted)" -ForegroundColor Gray
    } else {
        Write-Host "❌ No assignments found!" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "❌ Failed to get assignments: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}
Write-Host ""

# Test 5: Toggle Assignment Completion
Write-Host "Test 5: Mark Assignment as Complete" -ForegroundColor Yellow
try {
    $toggleResponse = Invoke-RestMethod "$base/api/assignments/$assignmentId/progress" `
        -Method PATCH `
        -WebSession $session
    
    Write-Host "✅ Assignment completion toggled!" -ForegroundColor Green
    Write-Host "   New Status: $($toggleResponse.data.status)" -ForegroundColor Gray
    Write-Host "   Completed At: $($toggleResponse.data.completedAt)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to toggle completion: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Assignment Progress
Write-Host "Test 6: Get Overall Progress" -ForegroundColor Yellow
try {
    $progressResponse = Invoke-RestMethod "$base/api/assignments/progress" `
        -Method GET `
        -WebSession $session
    
    Write-Host "✅ Progress retrieved!" -ForegroundColor Green
    
    foreach ($courseProgress in $progressResponse.data) {
        Write-Host "   Course: $($courseProgress.courseTitle)" -ForegroundColor Gray
        Write-Host "   Progress: $($courseProgress.completedAssignments)/$($courseProgress.totalAssignments) ($($courseProgress.progressPercentage)%)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to get progress: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Verify Dashboard
Write-Host "Test 7: Check Dashboard Stats" -ForegroundColor Yellow
try {
    $dashboardResponse = Invoke-RestMethod "$base/api/student/dashboard" `
        -Method GET `
        -WebSession $session
    
    Write-Host "✅ Dashboard stats retrieved!" -ForegroundColor Green
    Write-Host "   Enrolled Courses: $($dashboardResponse.totalEnrolledCourses)" -ForegroundColor Gray
    Write-Host "   Completed Assignments: $($dashboardResponse.completedAssignments)" -ForegroundColor Gray
    Write-Host "   Pending Assignments: $($dashboardResponse.pendingAssignments)" -ForegroundColor Gray
    Write-Host "   Certificates: $($dashboardResponse.certificates)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get dashboard: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "All Tests Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
